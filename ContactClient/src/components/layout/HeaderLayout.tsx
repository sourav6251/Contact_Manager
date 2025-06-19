import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import * as Toggle from "@radix-ui/react-toggle";
import { MoonIcon, SunMediumIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";
import { darkmodeStatus } from "@/redux/UserSlice";
import AppSidebar from "../common/AppSidebar";
import LogoutPopup from "../logout/LogoutPopup";
import { motion } from "framer-motion";

const HeaderLayout = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const isDark: Boolean = useSelector(
        (state: RootState) => state.user.darkmode
    );
    const [showModal, setShowModal] = useState(false);
    const loginStatus: Boolean = useSelector(
        (state: RootState) => state.user.login
    );
    const dispatch = useDispatch();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
            dispatch(darkmodeStatus(true));
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            setIsDarkMode(false);
            dispatch(darkmodeStatus(false));
            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, []);
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.setAttribute("data-theme", "dark");
                dispatch(darkmodeStatus(true));
            } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.setAttribute("data-theme", "light");
                dispatch(darkmodeStatus(false));
            }
            return !prev;
        });
    };

    const handleToggle = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.setAttribute("data-theme", "dark");
                dispatch(darkmodeStatus(true));
            } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.setAttribute("data-theme", "light");
                dispatch(darkmodeStatus(false));
            }
            return !prev;
        });
    };

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    const handleLogout = () => {
        setShowModal(true)
        // dispatch(logout());
        // toast.success("Logged out successfully");
        // navigate("/login");
    };
    return (
        <div className="h-screen flex flex-col">
{showModal && (
  <motion.div
    className="fixed inset-0 z-100 bg-transparent  flex items-center justify-center"
    initial={{x:0, opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0 }}
  >
    <LogoutPopup onClose={() => setShowModal(false)} />
  </motion.div>
)}


            <Header />
            <div className="h-full flex w-full">
            {loginStatus && (
                <div
                    className="h-full bg-background  transition-[width] duration-300 ease-in-out w-56 sm:w-64 data-[state=collapsed]:w-16"
                    data-state={isCollapsed ? "collapsed" : "expanded"}
                >
                        <AppSidebar
                            isCollapsed={isCollapsed}
                            toggleSidebar={toggleSidebar}
                            isDarkMode={isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                            onLogout={handleLogout}
                        />

                </div>
                    )}
                <div className="h-full w-full overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
            {!loginStatus && (
                <div className="fixed bottom-5 left-5 w-10 h-10 rounded-[5px] p-1 bg-green-100 dark:bg-green-900">
                    <Toggle.Root
                        className="h-full w-full"
                        pressed={isDarkMode}
                        onPressedChange={handleToggle}
                        aria-label="Toggle theme"
                    >
                        <div className="w-full h-full flex items-center justify-center cursor-pointer">
                            {isDarkMode ? (
                                <span className="text-black dark:text-white">
                                    <MoonIcon />
                                </span>
                            ) : (
                                <span className="text-black dark:text-white">
                                    <SunMediumIcon />
                                </span>
                            )}
                        </div>
                    </Toggle.Root>
                </div>
            )}
        </div>
    );
};

export default HeaderLayout;
