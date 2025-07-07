export interface ProfileData {
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
  email?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  languages?: string[];
  projects?: Array<{
    name: string;
    description?: string;
    url?: string;
    role?: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    duration?: string;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree?: string;
    field?: string;
    year?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: string;
    url?: string;
  }>;
  [key: string]: any;
}

export interface WebhookPayload {
  profile_content: string;  // base64 encoded YAML
  repository: string;       // owner/repo format
  ref: string;             // git ref
  commit_sha: string;      // commit SHA
}

export interface WebhookResponse {
  status?: string;      // 'accepted' for 202 responses
  success?: boolean;    // legacy field
  profileId?: string;
  message: string;
  errors?: string[];
  error?: string;       // for error responses
}