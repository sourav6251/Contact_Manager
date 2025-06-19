import { JSX, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Home, LogIn, Star, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";
import { Button } from "../ui/button";
import { logout } from "@/redux/UserSlice";
import { toast } from "sonner";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const loginState = useSelector((state: RootState) => state.user.login);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
        setShowLogoutConfirm(false);
    };

    const navItems = [
        { name: "Home", path: "/", hidden: false },
        { name: "Feature", path: "/feature", hidden: false },
        { name: "About", path: "/about", hidden: !loginState },
    ];

    const iconMap: Record<string, JSX.Element> = {
        Home: <Home size={16} className="ml-2 text-[#2f7299]" />,
        Login: <LogIn size={16} className="ml-2 text-[#2f7299]" />,
        Feature: <Star size={16} className="ml-2 text-[#2f7299]" />,
        About: <Info size={16} className="ml-2 text-[#2f7299]" />,
    };

    const menuVariantsMobile = {
        initial: { opacity: 0, y: -200 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.25,
                ease: "easeInOut",
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        },
        exit: {
            opacity: 0,
            y: -200,
            transition: { duration: 0.25, ease: "easeInOut" }
        }
    };

    const menuVariantsDesktop = {
        initial: { opacity: 0, x: -700 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        },
        exit: {
            opacity: 0,
            x: -700,
            transition: { duration: 0.5, ease: "easeInOut" }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, x: -30 },
        animate: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            x: -30,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-transparent border-b border-white/10 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {!loginState && 
                    <Avatar className="h-9 w-9 border-2 border-white/20 hover:border-amber-400/50 transition-all">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="text-xs font-medium bg-white/5">
                            SC
                        </AvatarFallback>
                    </Avatar>}
                </div>

                {/* Desktop Navigation */}
                <motion.nav
                    variants={menuVariantsDesktop}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="hidden md:flex items-center gap-2 backdrop-blur-sm bg-white/5 rounded-full p-1.5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                >
                    {navItems.map((item) => (
                        !item.hidden && (
                            <motion.div key={item.name} variants={itemVariants}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                                        relative px-6 py-1.5 text-sm font-medium transition-all duration-300 group
                                        ${isActive 
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
                                            <span className={`
                                                absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400/70 rounded-full
                                                group-hover:w-[60%] group-hover:left-[20%] transition-all duration-300
                                                ${isActive ? "w-[60%] left-[20%]" : ""}`
                                            }/>
                                        </>
                                    )}
                                </NavLink>
                                {/* <motion.div key="Logout" variants={itemVariants}>
                                
                                <Button  className="relative px-6 h-fit text-sm font-medium transition-all duration-300 group text-gray-300 hover:text-white hover:bg-white/5 hover:scale-110"
     >Hi     <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400/70 rounded-full group-hover:w-[60%] group-hover:left-[20%] transition-all duration-300" />
                                </Button>
                                </motion.div> */}
                            </motion.div>
                        )
                    ))}
{loginState ? (<></>
    // <motion.div key="Logout" variants={itemVariants}>
    //     <button
    //         onClick={() => setShowLogoutConfirm(true)}
    //         className="relative h-[1.7rem] px-6 py-1.5 text-sm font-medium transition-all duration-300 group text-gray-300 hover:text-white hover:bg-white/5  "
    //     >
    //         Logout
    //         {/* Add underline animation */}
    //         <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400/70 rounded-full group-hover:w-[60%] group-hover:left-[20%] transition-all duration-300" />
    //     </button>
    // </motion.div>
) : (
    <motion.div key="Login" variants={itemVariants}>
        <NavLink
            to="/login"
            className={({ isActive }) => `
                relative px-6 py-1.5 text-sm font-medium transition-all duration-300 group
                ${isActive 
                    ? "text-white bg-white/10 rounded-full scale-105"
                    : "text-gray-300 hover:text-white hover:bg-white/5 hover:scale-110"
                }`
            }
        >
            Login
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400/70 rounded-full group-hover:w-[60%] group-hover:left-[20%] transition-all duration-300" />
        </NavLink>
    </motion.div>
)}
                    {/* {loginState ? (
                        <motion.div key="Logout" variants={itemVariants}>
                            <Button
                                variant="ghost"
                                onClick={() => setShowLogoutConfirm(true)}
                                className="relative px-6 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 hover:scale-110"
                            >
                                Logout
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400/70 rounded-full group-hover:w-[60%] group-hover:left-[20%] transition-all duration-300" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div key="Login" variants={itemVariants}>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `
                                    relative px-6 py-1.5 text-sm font-medium transition-all duration-300 group
                                    ${isActive 
                                        ? "text-white bg-white/10 rounded-full scale-105"
                                        : "text-gray-300 hover:text-white hover:bg-white/5 hover:scale-110"
                                    }`
                                }
                            >
                                Login
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400/70 rounded-full group-hover:w-[60%] group-hover:left-[20%] transition-all duration-300" />
                            </NavLink>
                        </motion.div>
                    )} */}
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
                        {navItems.map((item) => (
                            !item.hidden && (
                                <motion.div key={item.name} variants={itemVariants}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => `
                                            flex items-center justify-between px-4 py-2 rounded-md font-medium transition-all duration-200
                                            ${isActive 
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
                        ))}

                        {loginState ? (
                            <motion.div key="Logout" variants={itemVariants}>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setShowLogoutConfirm(true);
                                    }}
                                    className="flex items-center justify-between w-full px-4 py-2 rounded-md font-medium text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                    <span>Logout</span>
                                    <LogIn size={16} className="ml-2 text-[#2f7299]" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="Login" variants={itemVariants}>
                                <NavLink
                                    to="/login"
                                    className="flex items-center justify-between w-full px-4 py-2 rounded-md font-medium text-gray-300 hover:text-white hover:bg-white/10"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>Login</span>
                                    <LogIn size={16} className="ml-2 text-[#2f7299]" />
                                </NavLink>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setShowLogoutConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                                Confirm Logout
                            </h2>
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-300">
                                    Are you sure you want to log out?
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="border-gray-300 dark:border-gray-600"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;