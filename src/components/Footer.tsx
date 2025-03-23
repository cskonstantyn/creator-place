import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-afghan-background-dark pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pt-10">
          <div>
            <h3 className="text-sm font-semibold uppercase text-purple-400 mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase text-purple-400 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-sm text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/help" className="text-sm text-gray-400 hover:text-white">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase text-purple-400 mb-4">For Businesses</h3>
            <ul className="space-y-2">
              <li><Link to="/advertise" className="text-sm text-gray-400 hover:text-white">Advertise</Link></li>
              <li><Link to="/business" className="text-sm text-gray-400 hover:text-white">Business Accounts</Link></li>
              <li><Link to="/partnerships" className="text-sm text-gray-400 hover:text-white">Partnerships</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase text-purple-400 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs">
          © {currentYear} CreatorDeals. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
