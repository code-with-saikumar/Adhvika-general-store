import { supabase } from '@/integrations/supabase/client';

interface OrderEmailData {
  orderId: string;
  items: { product_name: string; price: number; quantity: number }[];
  total: number;
  shipping_address: { name: string; phone: string; street: string; city: string; state: string; pincode: string };
  userEmail: string;
  userName: string;
}

const ADMIN_EMAIL = 'adhvikageneralstore@gmail.com';

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await supabase.functions.invoke('send-email', {
      body: { to, subject, html },
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const itemsTableHtml = (items: OrderEmailData['items']) => items.map(item => `
  <tr>
    <td style="padding:8px;border-bottom:1px solid #eee;">${item.product_name}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
  </tr>
`).join('');

const addressHtml = (addr: OrderEmailData['shipping_address']) => `
  <p><strong>${addr.name}</strong><br/>
  ${addr.street}<br/>
  ${addr.city}, ${addr.state} - ${addr.pincode}<br/>
  Phone: ${addr.phone}</p>
`;

export const sendOrderPlacedEmailToUser = async (data: OrderEmailData) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#D4AF37;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;">Order Confirmed! 🎉</h1>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
        <p>Hi ${data.userName},</p>
        <p>Thank you for your order! Your order <strong>#${data.orderId.slice(0, 8).toUpperCase()}</strong> has been placed successfully.</p>
        
        <h3 style="border-bottom:2px solid #D4AF37;padding-bottom:8px;">Order Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f9f9f9;">
              <th style="padding:8px;text-align:left;">Item</th>
              <th style="padding:8px;text-align:center;">Qty</th>
              <th style="padding:8px;text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsTableHtml(data.items)}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:bold;color:#D4AF37;">Total: ${formatCurrency(data.total)}</p>
        
        <h3 style="border-bottom:2px solid #D4AF37;padding-bottom:8px;">Delivery Address</h3>
        ${addressHtml(data.shipping_address)}
        
        <p style="color:#666;font-size:14px;margin-top:20px;">We'll notify you when your order is shipped. Thank you for shopping with Adhvika General Store!</p>
      </div>
    </div>`;

  await sendEmail(data.userEmail, `Order Confirmed #${data.orderId.slice(0, 8).toUpperCase()}`, html);
};

export const sendOrderPlacedEmailToAdmin = async (data: OrderEmailData) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#333;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4AF37;margin:0;">New Order Received! 📦</h1>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
        <p>A new order <strong>#${data.orderId.slice(0, 8).toUpperCase()}</strong> has been placed by <strong>${data.userName}</strong> (${data.userEmail}).</p>
        
        <h3 style="border-bottom:2px solid #D4AF37;padding-bottom:8px;">Order Items</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f9f9f9;">
              <th style="padding:8px;text-align:left;">Item</th>
              <th style="padding:8px;text-align:center;">Qty</th>
              <th style="padding:8px;text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsTableHtml(data.items)}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:bold;color:#D4AF37;">Total: ${formatCurrency(data.total)}</p>
        
        <h3 style="border-bottom:2px solid #D4AF37;padding-bottom:8px;">Shipping Address</h3>
        ${addressHtml(data.shipping_address)}
        
        <p style="background:#f0f0f0;padding:12px;border-radius:6px;font-size:14px;">
          📞 Customer Phone: <strong>${data.shipping_address.phone}</strong>
        </p>
      </div>
    </div>`;

  await sendEmail(ADMIN_EMAIL, `New Order #${data.orderId.slice(0, 8).toUpperCase()} from ${data.userName}`, html);
};

export const sendOrderShippedEmail = async (orderId: string, userEmail: string, userName: string, expectedDeliveryDate?: string | null) => {
  const deliveryInfo = expectedDeliveryDate 
    ? `<p style="background:#fff8e1;padding:12px;border-radius:6px;border-left:4px solid #D4AF37;">📅 Expected Delivery: <strong>${new Date(expectedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>`
    : '';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#2563eb;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;">Order Shipped! 🚚</h1>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
        <p>Hi ${userName},</p>
        <p>Great news! Your order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> has been shipped and is on its way to you.</p>
        ${deliveryInfo}
        <p>You can track your order status anytime from your orders page.</p>
        <p style="color:#666;font-size:14px;margin-top:20px;">Thank you for shopping with Adhvika General Store! 🙏</p>
      </div>
    </div>`;

  await sendEmail(userEmail, `Order Shipped #${orderId.slice(0, 8).toUpperCase()}`, html);
};

export const sendOrderDeliveredEmail = async (orderId: string, userEmail: string, userName: string) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#22c55e;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;">Order Delivered! ✅</h1>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
        <p>Hi ${userName},</p>
        <p>Great news! Your order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> has been delivered successfully.</p>
        <p>We hope you love your purchase! If you have any concerns, please don't hesitate to reach out to us.</p>
        <p style="color:#666;font-size:14px;margin-top:20px;">Thank you for shopping with Adhvika General Store! 🙏</p>
      </div>
    </div>`;

  await sendEmail(userEmail, `Order Delivered #${orderId.slice(0, 8).toUpperCase()}`, html);
};

export const sendOrderCancelledEmail = async (orderId: string, userEmail: string, userName: string) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#ef4444;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;">Order Cancelled ❌</h1>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
        <p>Hi ${userName},</p>
        <p>Your order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> has been cancelled.</p>
        <p>If you paid online, your refund will be processed within 5-7 business days.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p style="color:#666;font-size:14px;margin-top:20px;">Thank you for shopping with Adhvika General Store! 🙏</p>
      </div>
    </div>`;

  await sendEmail(userEmail, `Order Cancelled #${orderId.slice(0, 8).toUpperCase()}`, html);
};

export const sendOrderCancelledEmailToAdmin = async (orderId: string, userName: string, userEmail: string) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#333;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#ef4444;margin:0;">Order Cancelled ❌</h1>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
        <p>Order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> has been cancelled by <strong>${userName}</strong> (${userEmail}).</p>
      </div>
    </div>`;

  await sendEmail(ADMIN_EMAIL, `Order Cancelled #${orderId.slice(0, 8).toUpperCase()} by ${userName}`, html);
};
