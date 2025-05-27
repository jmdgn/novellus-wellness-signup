import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.warn('Missing required Twilio environment variables - SMS functionality disabled');
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

interface SMSParams {
  to: string;
  message: string;
}

export async function sendSMS(params: SMSParams): Promise<boolean> {
  try {
    console.log('Attempting to send SMS to:', params.to);
    
    const message = await client.messages.create({
      body: params.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: params.to,
    });

    console.log('SMS sent successfully. Message SID:', message.sid);
    return true;
  } catch (error: any) {
    console.error('Twilio SMS error:', error);
    return false;
  }
}