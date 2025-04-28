import { JSX, useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Home, LogIn, Star, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Home", path: "/", hidden: false },
        { name: "Login", path: "/login", hidden: false },
        { name: "Feature", path: "/feature", hidden: false },
        { name: "About", path: "/about", hidden: false },
    ];

    const iconMap: Record<string, JSX.Element> = {
        Home: <Home size={16} className="ml-2 text-[#2f7299]" />,
        Login: <LogIn size={16} className="ml-2 text-[#2f7299]" />,
        Feature: <Star size={16} className="ml-2 text-[#2f7299]" />,
        About: <Info size={16} className="ml-2 text-[#2f7299]" />,
    };

    // Animation variants for the mobile menu container
    const menuVariantsMobile = {
        initial: { opacity: 0, y: -200 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.25,
                ease: "easeInOut",
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            y: -200,
            transition: { duration: 0.25, ease: "easeInOut" },
        },
    };

    // Animation variants for the desktop nav container
    const menuVariantsDesktop = {
        initial: { opacity: 0, x: -700 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            x: -700,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
    };

    // Animation variants for each nav item (used in both mobile and desktop)
    const itemVariants = {
        initial: { opacity: 0, x: -30 },
        animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            x: -30,
            transition: { duration: 0.2, ease: "easeIn" },
        },
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-transparent  border-b border-white/10 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 border-2 border-white/20 hover:border-amber-400/50 transition-all">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="text-xs font-medium bg-white/5">
                            SC
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Desktop Nav */}
                <motion.nav
                    variants={menuVariantsDesktop}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="hidden md:flex items-center gap-2 backdrop-blur-sm bg-white/5 rounded-full p-1.5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                >
                    {navItems.map(
                        (item) =>
                            !item.hidden && (
                                <motion.div
                                    key={item.name}
                                    variants={itemVariants}
                                >
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `relative px-6 py-1.5 text-sm font-medium transition-all duration-300 group ${
                                                isActive
                                                    ? "text-white bg-white/10 rounded-full scale-105"
                                                    : "text-gray-300 hover:text-white hover:bg-white/5 hover:scale-110"
                                            }`
                                        }
                                        onClick={(e) => {
                                            e.currentTarget.classList.add("animate-pulse");
                                            setTimeout(() => {
                                                e.currentTarget.classList.remove("animate-pulse");
                                            }, 150);
                                        }}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {item.name}
                                                <span
                                                    className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400/70 rounded-full group-hover:w-[60%] group-hover:left-[20%] transition-all duration-300 ${
                                                        isActive ? "w-[60%] left-[20%]" : ""
                                                    }`}
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                </motion.div>
                            )
                    )}
                </motion.nav>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariantsMobile}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="md:hidden mt-2 backdrop-blur-sm flex flex-col gap-1 bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg"
                    >
                        {navItems.map(
                            (item) =>
                                !item.hidden && (
                                    <motion.div
                                        key={item.name}
                                        variants={itemVariants}
                                    >
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `flex items-center justify-between px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                                                    isActive
                                                        ? "text-white bg-white/10"
                                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                                }`
                                            }
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span>{item.name}</span>
                                            {iconMap[item.name]}
                                        </NavLink>
                                    </motion.div>
                                )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;