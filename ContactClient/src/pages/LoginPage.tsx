import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

import DesktopRegister from "@/components/auth/DesktopRegister";
import DesktopLogin from "@/components/auth/DesktopLogin";
import MobileLogin from "@/components/auth/MobileLogin";
import MobileRegister from "@/components/auth/MobileRegister";

const LoginPage = () => {
    const [moved, setMoved] = useState(false);
    const [sign, setSign] = useState("signin");


    return (
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                {/* Desktop View */}
                <div className="dark:bg-green-950 min-h-screen hidden md:flex w-full items-center justify-center">
                    <div className="dark:bg-[#848685] h-[26rem] hidden md:flex bg-white rounded-3xl shadow-xl overflow-hidden w-[50rem]">
                        {/* Left Panel */}
                        <motion.div
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: moved ? "100%" : "0%", opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="absolute self-center h-[26rem] w-[25rem] rounded-[5%_50%_0%_30%] bg-gradient-to-br from-[#7cffcb] to-[#089f90] dark:from-[#00C9A7] dark:to-[#045D5D] text-white flex-col justify-center items-center"
                        >
                            <div className="flex flex-col justify-between items-center pt-12 pb-10 h-full w-full text-white px-4">
                                {/* Logo */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                                        <img
                                            src="fire-svgrepo-com.svg"
                                            alt="Logo"
                                            className="p-3"
                                        />
                                    </div>
                                    <span className="text-white text-lg font-semibold">
                                        PhoneBook
                                    </span>
                                </div>

                                {/* Welcome Text */}
                                <div className="w-4/5 text-center mt-6 space-y-2">
                                    <span className="block text-2xl font-bold">
                                        {moved ? "Welcome" : "Welcome Back!"}
                                    </span>
                                    <span className="block text-sm">
                                        {moved
                                            ? "Don't have any account? Register now and start your journey with us."
                                            : "To stay connected, log in with your personal info."}
                                    </span>
                                </div>

                                {/* Toggle Button */}
                                <Button
                                    onClick={() => setMoved(!moved)}
                                    className="w-[60%] h-10 rounded-full border-2 border-white text-white hover:bg-white hover:text-green-700 transition"
                                >
                                    {moved ? "Sign In" : "Sign Up"}
                                </Button>
                            </div>
                        </motion.div>
                        {/* Sign Up */}
                        <div className="w-1/2 bg-white dark:bg-[#848685] px-10 py-0 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: moved ? 1 : 0,
                                    x: moved ? 0 : -20,
                                    transition: { duration: 0.6 },
                                    display: moved ? "block" : "none",
                                }}
                            >
                                <DesktopRegister />
                            </motion.div>
                        </div>
                        {/* Sign In */}

                        <div className="w-1/2 bg-white dark:bg-[#848685] p-10 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 1, x: 0 }}
                                animate={{
                                    opacity: moved ? 0 : 1,
                                    x: moved ? 20 : 0,
                                    transition: { duration: 0.3 },
                                    display: moved ? "none" : "block",
                                }}
                            >
                                <DesktopLogin />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden bg-gradient-to-t from-[#7CFFCBaa] to-[#089F8Fdd] dark:from-[#00C9A7] dark:to-[#045D5D] h-screen w-full">
                    {/* First Panel - Slides Up */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: moved ? -700 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 text-white flex flex-col items-center justify-between py-20 md:hidden z-50"
                    >
                        {/* Logo and Brand */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <img
                                    src="fire-svgrepo-com.svg"
                                    alt="Logo"
                                    className="p-3"
                                />
                            </div>
                            <span className="text-xl font-semibold">
                                PhoneBook
                            </span>
                        </div>

                        {/* Welcome Message */}
                        <div className="text-center space-y-2 mt-6">
                            <h1 className="text-2xl font-bold">Welcome</h1>
                            <p className="text-sm px-4">
                                To stay connected, log in with your personal
                                info.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 w-full max-w-xs pb-10">
                            <Button
                                onClick={() => setMoved(true)}
                                className="w-full h-11 rounded-full border-2 border-white text-white hover:bg-white hover:text-green-700 transition"
                            >
                                Sign In
                            </Button>
                        </div>
                    </motion.div>

                    {/* Second Panel - Fades/Slides In */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: moved ? 1 : 0, y: moved ? 0 : 50 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut",
                            delay: 0.2,
                        }}
                        className={`${
                            moved ? "flex" : "hidden"
                        } bg-white dark:bg-gray-400 h-screen w-full flex-col items-center justify-center`}
                    >
                        <div className="h-full w-full flex flex-col justify-center items-center">
                            <div className="bg-gradient-to-tl from-[#7CFFCBaa] to-[#089F8Fdd] dark:from-[#00C9A7] dark:to-[#045D5D] h-[35%] w-full flex flex-col justify-center items-center rounded-[0%_50%_0%_50%]">
                                <div className="h-full flex justify-center items-center rounded-[60%] w-[18rem] bg-transparent">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <img
                                                src="fire-svgrepo-com.svg"
                                                alt="Logo"
                                                className="p-3"
                                            />
                                        </div>
                                        <span className="text-xl font-semibold text-center">
                                            PhoneBook
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[65%] w-full  dark: rounded-xl shadow-md p-6 pt-0 flex flex-col justify-center gap-6 transition-colors">
                                {sign === "signin" ? (
                                    <>
                                        <MobileLogin />

                                        <p className="text-center text-sm text-gray-600 dark:text-black">
                                            Don't have an account?{" "}
                                            <span
                                                onClick={() =>
                                                    setSign("signup")
                                                }
                                                className="text-[#7CFFCBaa] dark:text-[#045D5D]   hover:underline cursor-pointer font-medium"
                                            >
                                                Sign Up
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                    <MobileRegister/>
                                       
                                        <p className="text-center text-sm text-gray-600 dark:text-back">
                                            Already have an account?{" "}
                                            <span
                                                onClick={() =>
                                                    setSign("signin")
                                                }
                                                className="text-[#7CFFCBaa] dark:text-[#045D5D]   hover:underline cursor-pointer font-medium"
                                            >
                                                Sign In
                                            </span>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default LoginPage;
