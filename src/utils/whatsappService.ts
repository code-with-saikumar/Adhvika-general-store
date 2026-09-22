const ADMIN_PHONE = '917337377689';

const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

const openWhatsApp = (phone: string, message: string) => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const sendOrderPlacedWhatsApp = (
  orderId: string,
  customerPhone: string,
  customerName: string,
  total: number,
  items: { product_name: string; quantity: number }[]
) => {
  const shortId = orderId.slice(0, 8).toUpperCase();
  const itemList = items.map(i => `• ${i.product_name} x${i.quantity}`).join('\n');

  // Message to customer
  const customerMsg = `🛒 *Order Confirmed!*\n\nHi ${customerName},\nYour order *#${shortId}* has been placed successfully!\n\n*Items:*\n${itemList}\n\n*Total:* ₹${total.toLocaleString()}\n\nThank you for shopping with Adhvika General Store! 🙏`;
  openWhatsApp(formatPhone(customerPhone), customerMsg);

  // Message to admin (delayed to avoid popup blocker)
  setTimeout(() => {
    const adminMsg = `📦 *New Order Received!*\n\n*Order ID:* #${shortId}\n*Customer:* ${customerName}\n*Phone:* ${customerPhone}\n\n*Items:*\n${itemList}\n\n*Total:* ₹${total.toLocaleString()}`;
    openWhatsApp(ADMIN_PHONE, adminMsg);
  }, 1500);
};

export const sendOrderShippedWhatsApp = (
  orderId: string,
  customerPhone: string,
  customerName: string,
  expectedDate?: string | null
) => {
  const shortId = orderId.slice(0, 8).toUpperCase();
  const dateInfo = expectedDate ? `\n*Expected Delivery:* ${expectedDate}` : '';
  const msg = `🚚 *Order Shipped!*\n\nHi ${customerName},\nYour order *#${shortId}* has been shipped!${dateInfo}\n\nTrack your order in the app.\n\n- Adhvika General Store`;
  openWhatsApp(formatPhone(customerPhone), msg);
};

export const sendOrderDeliveredWhatsApp = (
  orderId: string,
  customerPhone: string,
  customerName: string
) => {
  const shortId = orderId.slice(0, 8).toUpperCase();
  const msg = `✅ *Order Delivered!*\n\nHi ${customerName},\nYour order *#${shortId}* has been delivered!\n\nWe hope you love your purchase. Please share your review in the app! ⭐\n\n- Adhvika General Store`;
  openWhatsApp(formatPhone(customerPhone), msg);
};

export const sendOrderCancelledWhatsApp = (
  orderId: string,
  customerPhone: string,
  customerName: string,
  cancelledBy: 'customer' | 'admin'
) => {
  const shortId = orderId.slice(0, 8).toUpperCase();

  if (cancelledBy === 'customer') {
    // Notify admin
    const adminMsg = `❌ *Order Cancelled by Customer*\n\n*Order ID:* #${shortId}\n*Customer:* ${customerName}\n*Phone:* ${customerPhone}`;
    openWhatsApp(ADMIN_PHONE, adminMsg);
  } else {
    // Notify customer
    const customerMsg = `❌ *Order Cancelled*\n\nHi ${customerName},\nYour order *#${shortId}* has been cancelled.\n\nIf you have any questions, please contact us.\n\n- Adhvika General Store`;
    openWhatsApp(formatPhone(customerPhone), customerMsg);
  }
};
