export interface EmailForm {
  recipientName: string;
  recipientRole: string;
  purpose: EmailPurpose;
  senderName: string;
  keyPoints: string;
  tone: EmailTone;
  length: EmailLength;
}

export type EmailPurpose = 
  | 'Cold Outreach'
  | 'Follow-up'
  | 'Apology'
  | 'Job Application'
  | 'Networking'
  | 'Thank You'
  | 'Sales Pitch';

export type EmailTone = 
  | 'Formal'
  | 'Friendly'
  | 'Persuasive'
  | 'Casual'
  | 'Assertive';

export type EmailLength = 'Short' | 'Medium' | 'Long';

export interface GeneratedEmail {
  subject: string;
  body: string;
  timestamp: number;
  purpose: EmailPurpose;
}

export interface EmailHistory {
  emails: GeneratedEmail[];
}

export interface ApiResponse {
  subject: string;
  body: string;
  error?: string;
}
