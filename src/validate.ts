import * as core from '@actions/core';
import { ProfileData } from './types';

export function validateProfile(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Profile data must be an object'] };
  }

  const profile = data as ProfileData;

  // Validate string fields
  const stringFields = ['name', 'bio', 'company', 'location', 'email', 'website', 'twitter', 'github', 'linkedin'];
  for (const field of stringFields) {
    if (field in profile && typeof profile[field] !== 'string') {
      errors.push(`Field '${field}' must be a string`);
    }
  }

  // Validate email format if present
  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push('Invalid email format');
  }

  // Validate URL fields
  const urlFields = ['website', 'twitter', 'github', 'linkedin'];
  for (const field of urlFields) {
    if (profile[field] && typeof profile[field] === 'string') {
      try {
        new URL(profile[field] as string);
      } catch {
        if (field === 'twitter' && !profile[field]?.startsWith('http')) {
          // Allow twitter handles without URL
          if (!/^@?[a-zA-Z0-9_]+$/.test(profile[field] as string)) {
            errors.push(`Invalid Twitter handle format`);
          }
        } else if (field === 'github' && !profile[field]?.startsWith('http')) {
          // Allow GitHub usernames without URL
          if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(profile[field] as string)) {
            errors.push(`Invalid GitHub username format`);
          }
        } else {
          errors.push(`Field '${field}' must be a valid URL`);
        }
      }
    }
  }

  // Validate arrays
  const arrayFields = ['skills', 'languages'];
  for (const field of arrayFields) {
    if (field in profile) {
      if (!Array.isArray(profile[field])) {
        errors.push(`Field '${field}' must be an array`);
      } else {
        const arr = profile[field] as any[];
        if (!arr.every(item => typeof item === 'string')) {
          errors.push(`All items in '${field}' must be strings`);
        }
      }
    }
  }

  // Validate projects array
  if ('projects' in profile) {
    if (!Array.isArray(profile.projects)) {
      errors.push('Field \'projects\' must be an array');
    } else {
      profile.projects.forEach((project, index) => {
        if (!project.name || typeof project.name !== 'string') {
          errors.push(`Project at index ${index} must have a 'name' field`);
        }
      });
    }
  }

  // Validate experience array
  if ('experience' in profile) {
    if (!Array.isArray(profile.experience)) {
      errors.push('Field \'experience\' must be an array');
    } else {
      profile.experience.forEach((exp, index) => {
        if (!exp.company || typeof exp.company !== 'string') {
          errors.push(`Experience at index ${index} must have a 'company' field`);
        }
        if (!exp.position || typeof exp.position !== 'string') {
          errors.push(`Experience at index ${index} must have a 'position' field`);
        }
      });
    }
  }

  // Log validation results in debug mode
  if (core.getInput('debug') === 'true') {
    core.debug(`Profile validation completed with ${errors.length} errors`);
    if (errors.length > 0) {
      core.debug(`Validation errors: ${JSON.stringify(errors)}`);
    }
  }

  return { valid: errors.length === 0, errors };
}