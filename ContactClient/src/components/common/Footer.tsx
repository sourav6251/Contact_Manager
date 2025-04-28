import { NavLink } from "react-router-dom";
import { Twitter, Github, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 py-5 border-t w-full border-white/10 bottom-0 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 md:grid-cols-4 gap-10">
        {/* PhoneBook Info - Always appears first on mobile */}

        <div className="order-last col-span-3 md:order-none md:col-span-1">
        <h3 className="text-xl font-semibold mb-4 text-white">PhoneBook</h3>
        <p className="text-gray-400">The simplest way to store and manage your contacts online.</p>
        <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-amber-500 transition">
            <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition">
            <Github size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition">
            <Mail size={24} />
            </a>
        </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2">
            <li><NavLink to="/features" className="text-gray-400 hover:text-amber-500 transition">Features</NavLink></li>
            <li><NavLink to="/pricing" className="text-gray-400 hover:text-amber-500 transition">Pricing</NavLink></li>
            <li><NavLink to="/apps" className="text-gray-400 hover:text-amber-500 transition">Apps</NavLink></li>
            <li><NavLink to="/faq" className="text-gray-400 hover:text-amber-500 transition">FAQ</NavLink></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><NavLink to="/about" className="text-gray-400 hover:text-amber-500 transition">About Us</NavLink></li>
            <li><NavLink to="/careers" className="text-gray-400 hover:text-amber-500 transition">Careers</NavLink></li>
            <li><NavLink to="/privacy" className="text-gray-400 hover:text-amber-500 transition">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms" className="text-gray-400 hover:text-amber-500 transition">Terms of Service</NavLink></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><NavLink to="/help" className="text-gray-400 hover:text-amber-500 transition">Help Center</NavLink></li>
            <li><NavLink to="/contact" className="text-gray-400 hover:text-amber-500 transition">Contact Us</NavLink></li>
            <li><NavLink to="/status" className="text-gray-400 hover:text-amber-500 transition">Status</NavLink></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-2 border-t border-gray-700 pt-3">
        <p>© 2025 PhoneBook. All rights reserved.</p>
      </div>
    </footer>
  );
};
