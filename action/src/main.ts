import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import axios from 'axios';
import { validateProfile } from './validate';
import { ProfileData, WebhookPayload, WebhookResponse } from './types';

async function getOIDCToken(audience: string): Promise<string> {
  try {
    const token = await core.getIDToken(audience);
    return token;
  } catch (error) {
    throw new Error(`Failed to get OIDC token: ${error}`);
  }
}

async function readProfileFile(filePath: string): Promise<ProfileData> {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    core.debug(`Reading profile from: ${absolutePath}`);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Profile file not found at: ${filePath}`);
    }

    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const profileData = parse(fileContent);
    
    return profileData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read profile file: ${error.message}`);
    }
    throw error;
  }
}

async function run(): Promise<void> {
  try {
    // Get inputs
    const apiEndpoint = core.getInput('api-endpoint');
    const profilePath = core.getInput('profile-path');
    const debug = core.getInput('debug') === 'true';

    if (debug) {
      core.debug('Debug mode enabled');
      core.debug(`API Endpoint: ${apiEndpoint}`);
      core.debug(`Profile Path: ${profilePath}`);
    }

    // Get GitHub context
    const context = github.context;
    const { owner, repo } = context.repo;
    
    core.info(`🚀 Starting profiles.dev update for ${owner}/${repo}`);

    // Read and parse profile.yaml
    core.info(`📖 Reading profile from ${profilePath}`);
    const profileData = await readProfileFile(profilePath);
    
    if (debug) {
      core.debug(`Profile data: ${JSON.stringify(profileData, null, 2)}`);
    }

    // Validate profile data
    core.info('✅ Validating profile data');
    const validation = validateProfile(profileData);
    
    if (!validation.valid) {
      core.setFailed(`Profile validation failed with ${validation.errors.length} error(s)`);
      validation.errors.forEach(error => core.error(error));
      return;
    }

    core.info('✨ Profile validation successful');

    // Get OIDC token
    core.info('🔐 Obtaining OIDC token');
    const oidcToken = await getOIDCToken('api.profiles.dev');
    
    if (debug) {
      core.debug('OIDC token obtained successfully');
    }

    // Prepare webhook payload
    const payload: WebhookPayload = {
      profile: profileData,
      repository: {
        owner,
        name: repo,
        url: `https://github.com/${owner}/${repo}`
      },
      commit: {
        sha: context.sha,
        message: context.payload.head_commit?.message || 'Update profile',
        author: context.actor
      },
      timestamp: new Date().toISOString()
    };

    if (debug) {
      core.debug(`Webhook payload: ${JSON.stringify(payload, null, 2)}`);
    }

    // Send webhook request
    core.info('📤 Sending profile update to profiles.dev');
    
    try {
      const response = await axios.post<WebhookResponse>(apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${oidcToken}`,
          'X-GitHub-Repository': `${owner}/${repo}`,
          'X-GitHub-Actor': context.actor,
          'X-GitHub-SHA': context.sha,
          'User-Agent': 'profiles.dev-action/1.0'
        },
        timeout: 30000 // 30 second timeout
      });

      const { data } = response;

      if (data.success) {
        core.info(`✅ Profile updated successfully!`);
        if (data.profileId) {
          core.info(`📋 Profile ID: ${data.profileId}`);
          core.setOutput('profile-id', data.profileId);
        }
        core.setOutput('status', 'success');
        core.setOutput('message', data.message);
        
        // Set summary
        await core.summary
          .addHeading('profiles.dev Update Successful! 🎉')
          .addRaw(`Profile for **${owner}** has been updated.`)
          .addBreak()
          .addRaw(`**Profile ID:** ${data.profileId || 'N/A'}`)
          .addBreak()
          .addRaw(`**Message:** ${data.message}`)
          .addBreak()
          .addLink('View your profile', `https://profiles.dev/${owner}`)
          .write();
      } else {
        core.setFailed(`Profile update failed: ${data.message}`);
        if (data.errors) {
          data.errors.forEach(error => core.error(error));
        }
        core.setOutput('status', 'failed');
        core.setOutput('message', data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as WebhookResponse;
        
        if (status === 401) {
          core.setFailed('Authentication failed. Please ensure the repository has proper permissions.');
        } else if (status === 400) {
          core.setFailed(`Invalid request: ${data?.message || error.message}`);
          if (data?.errors) {
            data.errors.forEach(err => core.error(err));
          }
        } else if (status === 404) {
          core.setFailed('API endpoint not found. Please check the api-endpoint input.');
        } else if (status === 429) {
          core.setFailed('Rate limit exceeded. Please try again later.');
        } else if (status && status >= 500) {
          core.setFailed(`Server error (${status}): ${data?.message || 'Please try again later.'}`);
        } else {
          core.setFailed(`Request failed: ${error.message}`);
        }
        
        if (debug && error.response) {
          core.debug(`Response status: ${error.response.status}`);
          core.debug(`Response data: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        throw error;
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
      if (core.getInput('debug') === 'true') {
        core.debug(error.stack || '');
      }
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

// Run the action
run();