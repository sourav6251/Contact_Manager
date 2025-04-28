import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  UserPlus,
  Search,
  Lock,
  Tag,
  Cloud,
  Calendar,
  Twitter,
  Github,
  Mail,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";

const features = [
  { icon: Cloud, title: "Cloud Storage", desc: "Safely stored and synced across all devices." },
  { icon: Lock, title: "Secure Storage", desc: "Encrypted storage to keep your contacts safe." },
  { icon: Tag, title: "Smart Tags", desc: "Organize contacts with tags and groups." },
  { icon: Search, title: "Quick Search", desc: "Find any contact instantly." },
  { icon: UserPlus, title: "Easy Import/Export", desc: "Transfer contacts from any device easily." },
  { icon: Calendar, title: "Birthday Reminders", desc: "Never forget important dates." },
];

const steps = [
  { num: 1, title: "Create Your Account", desc: "Sign up with your email or social media." },
  { num: 2, title: "Add Your Contacts", desc: "Manually enter or import existing contacts." },
  { num: 3, title: "Access Anywhere", desc: "Web and mobile app access from any device." },
];

// Animations
const sectionFade = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const staggered = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const PhoneBookLandingPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-light)]">
    
      {/* Hero Section */}
      <motion.section
        className="pt-24 sm:pt-32 pb-16 sm:pb-24 text-center relative overflow-hidden bg-[var(--color-bg-dark)]"
        variants={sectionFade}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1616531770192-6eaea74c2456?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold font-mono text-[var(--color-primary-light)] mb-6 tracking-tight animate-fade-in-up"
          >
            Your Contacts, Safe & Organized
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-[var(--color-text-muted)] mb-8 sm:mb-10 max-w-3xl mx-auto animate-fade-in-up delay-100"
          >
            Create an account and securely store your phone numbers in one place. Access them anytime, anywhere, from any device.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200"
          >
            <NavLink
              to="/signup"
              className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-dark)] transition transform hover:scale-105 text-sm sm:text-base"
            >

              Get Started - It's Free
            </NavLink>
            <NavLink
              to="/learn-more"
              className="px-6 py-3 text-[var(--color-primary-light)] border-2 border-[var(--color-primary-light)] rounded-full hover:bg-[var(--color-primary)] hover:text-white transition transform hover:scale-105 text-sm sm:text-base"
            >
              Learn More
            </NavLink>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        id="features"
        className="py-16 sm:py-20 bg-[var(--color-bg)]"
        variants={sectionFade}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center mb-12" variants={cardFade}>
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
            <p className="text-[var(--color-text-muted)] mt-4 text-base sm:text-lg">
              Everything you need to manage your contacts effectively
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggered}
            initial="hidden"
            animate="visible"
          >
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="hover:scale-105 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md hover:shadow-lg transition duration-300"
                variants={cardFade}
              >
                <Icon size={32} className="text-[var(--color-primary-light)] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-[var(--color-text-muted)]">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how-it-works"
        className="py-16 sm:py-20 bg-[var(--color-bg-dark)]"
        variants={sectionFade}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center mb-12" variants={cardFade}>
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="text-[var(--color-text-muted)] mt-4 text-base sm:text-lg">Get started in just 3 simple steps</p>
          </motion.div>
          <motion.div
            className="flex flex-col md:flex-row justify-between gap-8"
            variants={staggered}
            initial="hidden"
            animate="visible"
          >
            {steps.map(({ num, title, desc }, i) => (
              <motion.div key={i} className="text-center" variants={cardFade}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--color-primary)] text-white text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  {num}
                  <div className="absolute inset-0 border-2 border-[var(--color-primary-light)] rounded-full animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-[var(--color-text-muted)]">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="bg-gradient-to-r from-black to-[var(--color-bg-dark)] py-16 sm:py-20 text-center relative"
        variants={sectionFade}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.h2 className="text-3xl sm:text-4xl font-bold mb-4" variants={cardFade}>
            Ready to Organize Your Contacts?
          </motion.h2>
          <motion.p className="text-lg text-[var(--color-text-muted)] mb-6" variants={cardFade}>
            Join thousands who trust PhoneBook to keep their contacts safe and organized.
          </motion.p>
          <motion.form
            className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto"
            variants={cardFade}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Sign up submitted!");
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="px-4 py-3 rounded-lg text-gray-800 flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition"
            >
              Sign Up Free
            </button>
          </motion.form>
          <div className="flex justify-center gap-4 mt-8">
            {[Twitter, Github, Mail].map((Icon, i) => (
              <a key={i} href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary-light)] transition">
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </motion.section>
      <Footer/>
    </div>
  );
};

export default PhoneBookLandingPage;
