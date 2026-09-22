# Advika General Store

Advika General Store is a modern online grocery shopping platform designed to help customers browse products, manage their shopping cart, and place orders conveniently online.

The application provides a simple and user-friendly shopping experience for a local grocery store, with product management and order-related functionality.

## Features

* 🛒 Browse grocery products
* 🔎 Search and explore products
* 🗂️ Product categories
* 🛍️ Add products to cart
* ➕ Increase or decrease product quantities
* 🗑️ Remove products from cart
* 💳 Online payment integration
* 📦 Order placement and management
* 👤 Customer-friendly shopping interface
* 📱 Responsive design for mobile, tablet, and desktop
* 🔐 Secure environment variable configuration
* ⚙️ Admin functionality for managing store data

## Tech Stack

* **Frontend:** React
* **Language:** TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **Payment Gateway:** Razorpay
* **Database / Backend Services:** Supabase
* **Version Control:** Git & GitHub

## Getting Started

### Prerequisites

Make sure the following are installed on your system:

* Node.js
* npm
* Git

You can verify the installations using:

```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd advika-general-store
```

Install the project dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory of the project.

Add the required configuration values:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If Razorpay or other services require additional configuration, add those values according to the application's backend configuration.

### Important

Never commit your `.env` file or expose secret API keys in the repository.

Add the following to `.gitignore`:

```gitignore
.env
.env.local
node_modules/
dist/
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
advika-general-store/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── ...
│
├── supabase/
├── test/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Payment Integration

The application supports online payments through Razorpay.

The typical payment flow is:

```text
Customer
   ↓
Select Products
   ↓
Add to Cart
   ↓
Checkout
   ↓
Razorpay Payment
   ↓
Payment Verification
   ↓
Order Confirmation
```

Payment credentials and other sensitive configuration values should always be stored securely using environment variables.

## Admin Features

The application can be extended with an administrative interface for managing:

* Products
* Product categories
* Prices
* Stock availability
* Customer orders
* Order status
* Store information

## Development Workflow

After making changes to the project:

```bash
git add .
git commit -m "Describe your changes"
git push
```

To retrieve the latest changes:

```bash
git pull
```

## Security

For security and production deployment:

* Never commit `.env` files.
* Never expose private API keys.
* Never store payment secrets in frontend code.
* Validate payment responses on the server.
* Validate user input before storing it.
* Use authenticated access for administrative functionality.
* Keep dependencies updated.

## Future Improvements

Possible future enhancements include:

* Delivery tracking
* Customer order history
* Product reviews and ratings
* Wishlist functionality
* Discount coupons
* Inventory management
* Sales analytics dashboard
* WhatsApp order notifications
* Location-based delivery
* Multiple payment options
* Automated order notifications

## License

This project is developed for educational and commercial development purposes.
