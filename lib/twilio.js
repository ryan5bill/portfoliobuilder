// Twilio SMS Integration
// https://www.twilio.com/docs/sms

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/**
 * Check if Twilio is configured
 */
export function isTwilioConfigured() {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone) {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (digits.length === 10) {
    return `+1${digits}`; // Assume US
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  } else if (digits.startsWith('+')) {
    return digits;
  }
  
  return `+${digits}`;
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS({ to, body }) {
  if (!isTwilioConfigured()) {
    throw new Error('Twilio is not configured');
  }

  const formattedTo = formatPhoneNumber(to);
  
  // Twilio uses Basic Auth
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formattedTo,
        From: TWILIO_PHONE_NUMBER,
        Body: body,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Twilio API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Send SMS to multiple recipients
 */
export async function sendBulkSMS({ phoneNumbers, body }) {
  if (!isTwilioConfigured()) {
    throw new Error('Twilio is not configured');
  }

  const results = {
    sent: 0,
    failed: 0,
    errors: []
  };

  // Send in parallel with a limit
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < phoneNumbers.length; i += BATCH_SIZE) {
    const batch = phoneNumbers.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (phone) => {
      try {
        await sendSMS({ to: phone, body });
        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push({ phone, error: error.message });
      }
    });

    await Promise.all(promises);
    
    // Rate limiting: wait between batches
    if (i + BATCH_SIZE < phoneNumbers.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return results;
}

/**
 * Send trade alert SMS
 */
export async function sendTradeAlertSMS({ phoneNumbers, alert }) {
  const { ticker, action, shares, price, portfolio } = alert;
  
  let body = `[${portfolio}] ${action}: ${ticker}`;
  
  if (shares && price) {
    body += ` - ${shares} shares @ $${price.toFixed(2)}`;
  }
  
  body += '\n\npbtracker.app';
  
  // Truncate if too long (SMS limit is 160 chars for single segment)
  if (body.length > 160) {
    body = body.slice(0, 157) + '...';
  }

  return sendBulkSMS({ phoneNumbers, body });
}

/**
 * Send verification code SMS
 */
export async function sendVerificationSMS({ to, code }) {
  const body = `Your Portfolio Builder verification code is: ${code}\n\nThis code expires in 10 minutes.`;
  return sendSMS({ to, body });
}

/**
 * Get account balance (for monitoring)
 */
export async function getAccountBalance() {
  if (!isTwilioConfigured()) {
    throw new Error('Twilio is not configured');
  }

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Balance.json`,
    {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get balance: ${response.status}`);
  }

  return response.json();
}
