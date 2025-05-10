import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { UserPlus, Search, Lock, Tag, Cloud, Calendar } from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";

const features = [
    {
        icon: Cloud,
        title: "Cloud Storage",
        desc: "Safely stored and synced across all devices.",
    },
    {
        icon: Lock,
        title: "Secure Storage",
        desc: "Encrypted storage to keep your contacts safe.",
    },
    {
        icon: Tag,
        title: "Smart Tags",
        desc: "Organize contacts with tags and groups.",
    },
    {
        icon: Search,
        title: "Quick Search",
        desc: "Find any contact instantly.",
    },
    {
        icon: UserPlus,
        title: "Easy Import/Export",
        desc: "Transfer contacts from any device easily.",
    },
    {
        icon: Calendar,
        title: "Birthday Reminders",
        desc: "Never forget important dates.",
    },
];

const steps = [
    {
        num: 1,
        title: "Create Your Account",
        desc: "Sign up with your email or social media.",
    },
    {
        num: 2,
        title: "Add Your Contacts",
        desc: "Manually enter or import existing contacts.",
    },
    {
        num: 3,
        title: "Access Anywhere",
        desc: "Web and mobile app access from any device.",
    },
];

// Animations
const sectionFade = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
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

const Landing = () => {
    const loginState = useSelector((state: RootState) => state.user.login);
    const navigate = useNavigate();
    const getStart = () => {
        if (!loginState) {
            console.log(loginState);

            navigate("/login");
        } else {
            navigate("/contacts");
        }
    };
    return (
        <PageWrapper>
            <div className="min-h-screen bg-sky-50 dark:bg-gray-800">
                {/* Hero Section */}
                <motion.section
                    className="pt-24 sm:pt-32 pb-16 sm:pb-24 text-center relative overflow-hidden"
                    variants={sectionFade}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-[#89F7FEaa] to-[#66A6FFdd] dark:from-[#00B4D8] dark:to-[#0077B6]" />
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                        <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-mono text-sky-900 dark:text-sky-200 mb-6 tracking-tight">
                            Your Contacts, Safe & Organized
                        </motion.h1>
                        <motion.p className="text-lg sm:text-xl text-sky-800 dark:text-sky-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
                            Create an account and securely store your phone
                            numbers in one place. Access them anytime, anywhere,
                            from any device.
                        </motion.p>
                        <motion.div className="flex flex-col sm:flex-row justify-center gap-4">
                            <div
                                onClick={getStart}
                                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#66A6FF] to-[#89F7FE] text-white font-semibold rounded-full hover:from-[#5591FF] hover:to-[#78E7FE] transition transform hover:scale-105 text-sm sm:text-base"
                            >
                                Get Started - It's Free
                            </div>
                            <NavLink
                                to="/learn-more"
                                className="px-6 py-3 border-2 border-sky-900 dark:border-sky-200 text-sky-900 dark:text-sky-200 rounded-full hover:bg-sky-900/10 dark:hover:bg-sky-200/10 transition transform hover:scale-105 text-sm sm:text-base"
                            >
                                Learn More
                            </NavLink>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Features */}
                <motion.section
                    id="features"
                    className="py-16 sm:py-20 bg-[#f5fbff] dark:bg-gray-900"
                    variants={sectionFade}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <motion.div
                            className="text-center mb-12"
                            variants={cardFade}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 dark:text-sky-200">
                                Powerful Features
                            </h2>
                            <p className="text-sky-800 dark:text-sky-100 mt-4 text-base sm:text-lg">
                                Everything you need to manage your contacts
                                effectively
                            </p>
                        </motion.div>
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={staggered}
                            initial="hidden"
                            animate="visible"
                        >
                            {features.map(({ icon: Icon, title, desc }, i) => (
                                <motion.div
                                    key={i}
                                    className="hover:scale-105 p-6 bg-white dark:bg-gray-800 rounded-xl border border-sky-100 dark:border-sky-900/50 hover:shadow-lg transition duration-300"
                                    variants={cardFade}
                                >
                                    <Icon
                                        size={32}
                                        className="text-[#66A6FF] dark:text-[#89F7FE] mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-sky-900 dark:text-sky-200 mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-sky-800 dark:text-sky-100">
                                        {desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* How It Works */}
                <motion.section
                    id="how-it-works"
                    className="py-16 sm:py-20 bg-sky-50 dark:bg-gray-800"
                    variants={sectionFade}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <motion.div
                            className="text-center mb-12"
                            variants={cardFade}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 dark:text-sky-200">
                                How It Works
                            </h2>
                            <p className="text-sky-800 dark:text-sky-100 mt-4 text-base sm:text-lg">
                                Get started in just 3 simple steps
                            </p>
                        </motion.div>
                        <motion.div
                            className="flex flex-col md:flex-row justify-between gap-8"
                            variants={staggered}
                            initial="hidden"
                            animate="visible"
                        >
                            {steps.map(({ num, title, desc }, i) => (
                                <motion.div
                                    key={i}
                                    className="text-center"
                                    variants={cardFade}
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#66A6FF] to-[#89F7FE] text-white text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 relative">
                                        {num}
                                        <div className="absolute inset-0 border-2 border-sky-200 dark:border-sky-400 rounded-full animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-sky-900 dark:text-sky-200 mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-sky-800 dark:text-sky-100">
                                        {desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Call to Action */}
                <motion.section
                    className=" overflow-hidden bg-gradient-to-r from-sky-300 to-sky-500 dark:from-sky-200 dark:to-sky-400 py-16 sm:py-20 text-center relative"
                    variants={sectionFade}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] overflow-hidden" />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10  overflow-hidden">
                        <motion.h2
                            className="text-3xl sm:text-4xl font-bold text-white mb-4"
                            variants={cardFade}
                        >
                            Ready to Organize Your Contacts?
                        </motion.h2>
                        <motion.p
                            className="text-lg text-sky-100 mb-6"
                            variants={cardFade}
                        >
                            Join thousands who trust PhoneBook to keep their
                            contacts safe and organized.
                        </motion.p>
                        <motion.form
                            className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto"
                            variants={cardFade}
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                required
                                placeholder="Enter your email address"
                                className="px-4 py-3 rounded-lg border-2 border-sky-200 text-sky-800 flex-1 focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-sky-200 text-blue-900 font-semibold rounded-lg hover:bg-sky-300 transition"
                            >
                                Sign Up Free
                            </button>
                        </motion.form>
                    </div>
                </motion.section>
                <Footer />
            </div>
        </PageWrapper>
    );
};

export default Landing;
