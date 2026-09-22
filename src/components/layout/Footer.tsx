import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Smartphone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Adhvika Store</h3>
            <p className="text-primary-foreground/80 text-sm mb-3">
              Your one-stop shop for general groceries, beautiful bangles, and fancy items. 
              Serving the community with quality products since years.
            </p>
            <p className="text-primary-foreground/90 text-sm font-medium">
              Owner: Vinod Kumar
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/adhvika_general_store?igsh=ZmtzbmphdzViMDJr" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://wa.me/917337377689" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=general" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  General Store
                </Link>
              </li>
              <li>
                <Link to="/products?category=bangles" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Bangles
                </Link>
              </li>
              <li>
                <Link to="/products?category=fancy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Fancy Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/install" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  Download App
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <Phone className="h-4 w-4 shrink-0 mt-0.5" />
                <a href="tel:+917337377689" className="text-primary-foreground/80 hover:text-primary-foreground">
                  7337377689
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/mMtpPBbKjj9XYnzM9" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground">
                  New Bus Stand Road, Lokeshwaram
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:adhvikageneralstore@gmail.com" className="text-primary-foreground/80 hover:text-primary-foreground">
                  adhvikageneralstore@gmail.com
                </a>
              </li>
              <li className="flex gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="text-primary-foreground/80">
                  Mon - Sun: 8:00 AM - 8:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container py-4 text-center text-sm text-primary-foreground/70">
          <p>© {new Date().getFullYear()} Adhvika Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
