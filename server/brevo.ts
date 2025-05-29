interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(
  apiKey: string,
  params: EmailParams
): Promise<boolean> {
  try {
    console.log('Attempting to send email to:', params.to, 'from:', params.from);
    
    const emailData = {
      sender: { 
        email: params.from,
        name: "Beatriz @ Novellus Wellness"
      },
      to: [{ email: params.to }],
      subject: params.subject,
      htmlContent: params.html,
      textContent: params.text
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    console.log('Brevo response:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo error response:', errorText);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('Brevo email error:', error);
    return false;
  }
}