// Beehiiv Email Integration
// https://developers.beehiiv.com/docs/v2

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2';

/**
 * Check if Beehiiv is configured
 */
export function isBeehiivConfigured() {
  return !!(BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID);
}

/**
 * Make authenticated request to Beehiiv API
 */
async function beehiivRequest(endpoint, options = {}) {
  if (!isBeehiivConfigured()) {
    throw new Error('Beehiiv is not configured');
  }

  const response = await fetch(`${BEEHIIV_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Beehiiv API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get publication stats
 */
export async function getPublicationStats() {
  return beehiivRequest(`/publications/${BEEHIIV_PUBLICATION_ID}`);
}

/**
 * Get subscriber count
 */
export async function getSubscriberCount() {
  const data = await beehiivRequest(
    `/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions?limit=1`
  );
  return data.total_results || 0;
}

/**
 * Add subscriber
 */
export async function addSubscriber({ email, name, utm_source = 'pbtracker' }) {
  return beehiivRequest(`/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      name,
      utm_source,
      reactivate_existing: true,
    }),
  });
}

/**
 * Remove subscriber
 */
export async function removeSubscriber(email) {
  return beehiivRequest(
    `/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions/email/${email}`,
    { method: 'DELETE' }
  );
}

/**
 * Create and send email post
 */
export async function sendEmailPost({ subject, content, preview_text }) {
  // Create post
  const post = await beehiivRequest(`/publications/${BEEHIIV_PUBLICATION_ID}/posts`, {
    method: 'POST',
    body: JSON.stringify({
      title: subject,
      subtitle: preview_text,
      content_html: content,
      status: 'draft',
    }),
  });

  // Publish immediately
  if (post.data?.id) {
    await beehiivRequest(`/publications/${BEEHIIV_PUBLICATION_ID}/posts/${post.data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'published',
        send_to_subscribers: true,
      }),
    });
  }

  return post;
}

/**
 * Send simple email broadcast
 * Note: Beehiiv requires creating posts, not direct emails
 */
export async function sendBroadcastEmail({ subject, content }) {
  // Convert plain text to HTML
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0a0a0a; padding: 20px; border-radius: 8px; color: #e0e0e0;">
        ${content.split('\n').map(line => `<p style="margin: 0 0 16px 0;">${line}</p>`).join('')}
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Sent from Portfolio Builder | <a href="https://pbtracker.app" style="color: #00d4aa;">pbtracker.app</a>
      </p>
    </div>
  `;

  return sendEmailPost({
    subject,
    content: htmlContent,
    preview_text: content.slice(0, 140),
  });
}

/**
 * Get all subscribers (paginated)
 */
export async function getAllSubscribers(limit = 100) {
  const subscribers = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await beehiivRequest(
      `/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions?limit=${limit}&page=${page}`
    );
    
    subscribers.push(...(data.data || []));
    hasMore = data.data?.length === limit;
    page++;
    
    // Safety limit
    if (page > 50) break;
  }

  return subscribers;
}
