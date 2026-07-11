/**
 * WhatsApp Cloud API Helper - Multi-Template Notification System
 * Supports: Order Confirmation, Order Ready, Thank You/Feedback, Annual Event Reminders
 */

/**
 * Cleans a phone number to match Meta WhatsApp API format (only digits, with country code).
 * Prepends '91' (India) if a standard 10-digit number is passed.
 */
function cleanPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

/**
 * Notification trigger types mapped to environment variable template names.
 */
type NotificationType = 'order_confirmed' | 'order_completed' | 'order_sold' | 'annual_reminder';

interface NotificationPayload {
  toMobile: string;
  customerName: string;
  orderId?: string;
  totalAmount?: number;
  eventType?: string;
}

/**
 * Resolves the Meta template name from .env based on the notification type.
 */
function getTemplateName(type: NotificationType): string {
  switch (type) {
    case 'order_confirmed':
      return process.env.META_WHATSAPP_TEMPLATE_NAME || 'hello_world';
    case 'order_completed':
      return process.env.META_TEMPLATE_ORDER_COMPLETED || 'hello_world';
    case 'order_sold':
      return process.env.META_TEMPLATE_ORDER_SOLD || 'hello_world';
    case 'annual_reminder':
      return process.env.META_TEMPLATE_ANNUAL_REMINDER || 'hello_world';
    default:
      return 'hello_world';
  }
}

/**
 * Builds the template components (parameters) based on notification type.
 * Returns undefined for hello_world (no parameters needed).
 */
function buildTemplateComponents(type: NotificationType, templateName: string, payload: NotificationPayload) {
  // hello_world is Meta's sandbox template - it takes no parameters
  if (templateName === 'hello_world') {
    return undefined;
  }

  switch (type) {
    case 'order_confirmed':
      const components: any[] = [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: payload.customerName },
            { type: 'text', text: payload.orderId || 'N/A' },
            { type: 'text', text: `Rs. ${payload.totalAmount || 0}` }
          ]
        }
      ];

      if (process.env.META_WHATSAPP_QR_IMAGE_URL) {
        components.push({
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: {
                link: process.env.META_WHATSAPP_QR_IMAGE_URL
              }
            }
          ]
        });
      }

      return components;

    case 'order_completed':
      return [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: payload.customerName },
            { type: 'text', text: payload.orderId || 'N/A' }
          ]
        }
      ];

    case 'order_sold':
      return [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: payload.customerName },
            { type: 'text', text: payload.orderId || 'N/A' }
          ]
        }
      ];

    case 'annual_reminder':
      return [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: payload.customerName },
            { type: 'text', text: payload.eventType || 'celebration' }
          ]
        }
      ];

    default:
      return undefined;
  }
}

/**
 * Core function: sends a WhatsApp message via Meta Cloud API.
 */
async function sendMetaMessage(recipientNumber: string, templateName: string, components?: any[]): Promise<boolean> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.warn('WhatsApp API warning: META_ACCESS_TOKEN or META_PHONE_NUMBER_ID is not configured in .env');
    return false;
  }

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const body: Record<string, any> = {
    messaging_product: 'whatsapp',
    to: recipientNumber,
    type: 'template',
    template: {
      name: templateName,
      language: { code: templateName === 'hello_world' ? 'en_US' : 'en' }
    }
  };

  if (components) {
    body.template.components = components;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(`Meta WhatsApp API error [${templateName}]:`, responseData);
      return false;
    }

    console.log(`WhatsApp [${templateName}] sent successfully to ${recipientNumber}`);
    return true;
  } catch (error) {
    console.error(`Error sending WhatsApp [${templateName}]:`, error);
    return false;
  }
}

// ========== PUBLIC API ==========

/**
 * Send order confirmation notification when a new order is placed.
 */
export async function sendWhatsAppNotification(
  toMobile: string,
  customerName: string,
  orderId: string,
  totalAmount: number
): Promise<boolean> {
  const templateName = getTemplateName('order_confirmed');
  const recipientNumber = cleanPhoneNumber(toMobile);
  const components = buildTemplateComponents('order_confirmed', templateName, {
    toMobile, customerName, orderId, totalAmount
  });
  return sendMetaMessage(recipientNumber, templateName, components);
}

/**
 * Send notification when admin marks an order as "Completed" (ready for pickup).
 */
export async function sendOrderCompletedNotification(
  toMobile: string,
  customerName: string,
  orderId: string
): Promise<boolean> {
  const templateName = getTemplateName('order_completed');
  const recipientNumber = cleanPhoneNumber(toMobile);
  const components = buildTemplateComponents('order_completed', templateName, {
    toMobile, customerName, orderId
  });
  return sendMetaMessage(recipientNumber, templateName, components);
}

/**
 * Send thank-you notification when admin marks an order as "Sold".
 */
export async function sendOrderSoldNotification(
  toMobile: string,
  customerName: string,
  orderId: string
): Promise<boolean> {
  const templateName = getTemplateName('order_sold');
  const recipientNumber = cleanPhoneNumber(toMobile);
  const components = buildTemplateComponents('order_sold', templateName, {
    toMobile, customerName, orderId
  });
  return sendMetaMessage(recipientNumber, templateName, components);
}

/**
 * Send annual event anniversary reminder (1 week before delivery date).
 */
export async function sendAnnualReminderNotification(
  toMobile: string,
  customerName: string,
  eventType: string
): Promise<boolean> {
  const templateName = getTemplateName('annual_reminder');
  const recipientNumber = cleanPhoneNumber(toMobile);
  const components = buildTemplateComponents('annual_reminder', templateName, {
    toMobile, customerName, eventType
  });
  return sendMetaMessage(recipientNumber, templateName, components);
}
