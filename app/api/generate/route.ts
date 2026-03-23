import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { buildPrompt } from '@/lib/prompt';
import { ApiResponse } from '@/types';

const requestSchema = z.object({
  recipientName: z.string().min(1),
  recipientRole: z.string().min(1),
  purpose: z.enum(['Cold Outreach', 'Follow-up', 'Apology', 'Job Application', 'Networking', 'Thank You', 'Sales Pitch']),
  senderName: z.string().min(1),
  keyPoints: z.string().min(1),
  tone: z.enum(['Formal', 'Friendly', 'Persuasive', 'Casual', 'Assertive']),
  length: z.enum(['Short', 'Medium', 'Long'])
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (record.count >= 10) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Mock mode for testing without API credits
    if (process.env.USE_MOCK_API === 'true') {
      const requestBody = await request.json();
      
      // Generate realistic mock emails based on purpose and tone
      const generateMockEmail = (data: any) => {
        const { recipientName, recipientRole, purpose, senderName, keyPoints, tone, length } = data;
        
        type EmailPurpose = 'Cold Outreach' | 'Follow-up' | 'Job Application' | 'Apology' | 'Networking' | 'Thank You' | 'Sales Pitch';
        type EmailTone = 'Formal' | 'Friendly';
        
        const emails: Record<EmailPurpose, Record<EmailTone, { subject: string; body: string }>> = {
          'Cold Outreach': {
            Formal: {
              subject: `Exploring Potential Collaboration with ${recipientRole}`,
              body: `Dear ${recipientName},

I hope this message finds you well. I came across your work as ${recipientRole} and was particularly impressed by your expertise in the field.

My name is ${senderName}, and I believe there could be valuable synergies between our professional backgrounds. Given your experience, I would appreciate the opportunity to discuss potential collaboration avenues.

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Would you be available for a brief 15-minute call next week to explore this further?

Sincerely,
${senderName}`
            },
            Friendly: {
              subject: `Quick question about ${recipientRole} work`,
              body: `Hi ${recipientName},

I've been following your work as ${recipientRole} and really admire what you're doing!

I'm ${senderName}, and I have some ideas that might align with your expertise. 

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Would you be open to a quick chat sometime next week?

Best,
${senderName}`
            }
          },
          'Follow-up': {
            Formal: {
              subject: `Following up on our recent conversation`,
              body: `Dear ${recipientName},

It was a pleasure speaking with you recently. I wanted to follow up on our discussion regarding ${keyPoints.split('\n').filter((p: string) => p.trim())[0]?.replace('•', '').trim() || 'our previous conversation'}.

As promised, I wanted to ensure we covered the key points we discussed:
${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Please let me know if you need any additional information or if you'd like to schedule another discussion.

Regards,
${senderName}`
            },
            Friendly: {
              subject: `Great connecting earlier!`,
              body: `Hi ${recipientName},

Really enjoyed our conversation earlier! Just wanted to follow up on what we discussed.

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Let me know if you need anything else from my end. Looking forward to continuing our conversation!

Cheers,
${senderName}`
            }
          },
          'Job Application': {
            Formal: {
              subject: `Application for ${recipientRole} Position`,
              body: `Dear ${recipientName},

I am writing to express my strong interest in the ${recipientRole} position at your organization. With my background and skills, I am confident I would be a valuable addition to your team.

My qualifications align well with your requirements:
${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

I would welcome the opportunity to discuss how my experience can benefit your organization.

Sincerely,
${senderName}`
            },
            Friendly: {
              subject: `Excited about the ${recipientRole} opportunity!`,
              body: `Hi ${recipientName},

I'm really excited about the ${recipientRole} position and wanted to reach out directly!

Here's why I think I'd be a great fit:
${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Would love to chat more about how I can contribute to your team.

Best,
${senderName}`
            }
          },
          'Apology': {
            Formal: {
              subject: `Apology regarding recent matter`,
              body: `Dear ${recipientName},

I am writing to sincerely apologize for ${keyPoints.split('\n').filter((p: string) => p.trim())[0]?.replace('•', '').trim() || 'the recent issue'}.

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

I take full responsibility and am committed to making this right.

Regards,
${senderName}`
            },
            Friendly: {
              subject: `Sorry about that!`,
              body: `Hi ${recipientName},

I wanted to sincerely apologize for what happened.

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Hope we can move past this.

Best,
${senderName}`
            }
          },
          'Networking': {
            Formal: {
              subject: `Networking opportunity with ${recipientRole}`,
              body: `Dear ${recipientName},

I hope this message finds you well. I'm reaching out as ${recipientRole} and would value the opportunity to connect professionally.

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

I would appreciate the chance to learn from your experience.

Sincerely,
${senderName}`
            },
            Friendly: {
              subject: `Love to connect!`,
              body: `Hi ${recipientName},

I've been hoping to connect with you as a fellow ${recipientRole}!

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Would be great to chat sometime!

Best,
${senderName}`
            }
          },
          'Thank You': {
            Formal: {
              subject: `Thank you for your assistance`,
              body: `Dear ${recipientName},

I wanted to express my sincere gratitude for ${keyPoints.split('\n').filter((p: string) => p.trim())[0]?.replace('•', '').trim() || 'your help'}.

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Your support is greatly appreciated.

Regards,
${senderName}`
            },
            Friendly: {
              subject: `Thanks so much!`,
              body: `Hi ${recipientName},

Just wanted to say thank you for everything!

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Really appreciate you!

Best,
${senderName}`
            }
          },
          'Sales Pitch': {
            Formal: {
              subject: `Business proposal for ${recipientRole}`,
              body: `Dear ${recipientName},

I am writing to present a valuable opportunity for you as ${recipientRole}.

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

I believe this could significantly benefit your organization.

Sincerely,
${senderName}`
            },
            Friendly: {
              subject: `Quick idea for you!`,
              body: `Hi ${recipientName},

I have an idea I think you'll love as ${recipientRole}!

${keyPoints.split('\n').filter((p: string) => p.trim()).map((p: string) => p.replace('•', '').trim()).join('. ') + '.'}

Let me know what you think!

Best,
${senderName}`
            }
          }
        };

        // Get email template or create a default one
        const purposeTemplates = emails[purpose as EmailPurpose] || emails['Cold Outreach'];
        const emailTemplate = purposeTemplates[tone as EmailTone] || purposeTemplates['Friendly'];
        
        return emailTemplate;
      };

      const mockEmail = generateMockEmail(requestBody);
      return NextResponse.json(mockEmail);
    }

    const ip = request.ip || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const requestBody = await request.json();
    const validatedData = requestSchema.parse(requestBody);
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { system, user } = buildPrompt(validatedData);

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: user }],
      stream: false
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    const subjectMatch = content.text.match(/<subject>(.*?)<\/subject>/);
    const bodyMatch = content.text.match(/<body>(.*?)<\/body>/);

    let subject = '';
    let emailBody = '';

    if (subjectMatch && bodyMatch) {
      subject = subjectMatch[1].trim();
      emailBody = bodyMatch[1].trim();
    } else {
      const lines = content.text.split('\n').filter((line: string) => line.trim());
      subject = lines[0] || 'Generated Email';
      emailBody = lines.slice(1).join('\n').trim();
    }

    const apiResponse: ApiResponse = { subject, body: emailBody };
    return NextResponse.json(apiResponse);

  } catch (error: any) {
    console.error('API Error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate email', message: error.message },
      { status: 500 }
    );
  }
}
