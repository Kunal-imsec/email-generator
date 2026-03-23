import { EmailForm, EmailPurpose } from '@/types';

const FEW_SHOT_EXAMPLES = `
Example 1 - Cold Outreach:
<email>
  <subject>Exploring potential collaboration between [Your Company] and [Their Company]</subject>
  <body>
Hi [Recipient Name],

I came across your work at [Their Company] and was impressed by [specific achievement].

I'm [Your Name] from [Your Company], where we [what you do]. Given your expertise in [their field], I believe there could be valuable synergies between our teams.

Would you be open to a 15-minute call next week to explore how we might work together?

Best regards,
[Your Name]
  </body>
</email>

Example 2 - Follow-up:
<email>
  <subject>Following up on our conversation about [topic]</subject>
  <body>
Hi [Recipient Name],

Great connecting with you [when/where] regarding [topic].

As promised, I wanted to [action item]. I've attached [relevant information] for your review.

Are you available to discuss next steps sometime this week? I'm flexible on timing.

Looking forward to continuing our conversation.

Best,
[Your Name]
  </body>
</email>
`;

export function buildPrompt(form: EmailForm): { system: string; user: string } {
  const systemPrompt = `You are an expert email copywriter with 15 years of experience writing high-converting, professional emails across sales, HR, and business communication.

Rules you always follow:
- Match the requested tone precisely
- Never use filler phrases like "I hope this email finds you well"
- Always include a clear call-to-action
- Keep sentences concise and scannable
- Personalize using the recipient's name and role

Output format — always respond with ONLY this XML structure, nothing else:
<email>
  <subject>Your subject line here</subject>
  <body>
Full email body here, with proper line breaks.
  </body>
</email>

${FEW_SHOT_EXAMPLES}`;

  const lengthGuidelines = {
    Short: 'Keep it concise, around 100 words',
    Medium: 'Standard professional length, around 200 words', 
    Long: 'Comprehensive and detailed, around 350 words'
  };

  const userPrompt = `Write a ${form.purpose} email with the following details:

Recipient: ${form.recipientName}, ${form.recipientRole}
Sender: ${form.senderName}
Tone: ${form.tone}
Length: ${lengthGuidelines[form.length]}

Key points to cover:
${form.keyPoints}

Generate the email now.`;

  return { system: systemPrompt, user: userPrompt };
}
