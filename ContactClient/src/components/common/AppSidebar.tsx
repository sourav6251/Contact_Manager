import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Sun, LogOut, CircleUserRound,  BookUser, Settings } from "lucide-react";
import clsx from "clsx";
import {  useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "@/redux/SliceStore";

const links=[
    { to: "/profile", label: "Profile", icon: <CircleUserRound size={20} /> },
    { to: "/contacts", label: "Contacts", icon: <BookUser size={20} /> },
    // { to: "/tags", label: "Tags", icon: <Tags size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ]
  interface SidebarProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    onLogout: () => void;
  }
  
const AppSidebar = ({
    isDarkMode ,
    toggleDarkMode ,
    isCollapsed ,
    toggleSidebar ,
    onLogout
}:SidebarProps) => {
    const userName: any = useSelector(
        (state: RootState) => state.user.userName
    );


    const sidebarVariants = {
        expanded: { width: 240 },
        collapsed: { width: 64 },
    };

    return (
        <motion.div
            variants={sidebarVariants}
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
            transition={{ duration: 0.3 }}
            className="sticky top-0 h-screen z-10 shadow-xl border-r 
                 bg-gradient-to-tr from-[#89F7FEaa] to-[#66A6FFdd]
                 dark:from-[#00B4D8] dark:to-[#0077B6] text-white
                 flex flex-col justify-between"
        >

{/* {showModal && <LogoutPopup />} */}
            {/* 🔷 Top: Logo */}
            <div className="flex flex-col items-center justify-center py-8 border-b border-white/20">
                <div
                    className={clsx(
                        "bg-slate-100 dark:bg-slate-400 rounded-full overflow-hidden flex items-center justify-center transition-all",
                        isCollapsed ? "w-10 h-10" : "w-16 h-16"
                    )}
                >
                    <img
                        src="LOGO.png"
                        alt="logo"
                        className="w-3/4 h-3/4 object-contain"
                    />
                </div>

                { !isCollapsed && userName}
            </div>

            {/* 📦 Main Content */}
            <motion.div className="flex-1 px-2 py-4">
  <nav className="flex flex-col gap-3">
    {links.map(({ to, label, icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          clsx(
            "flex items-center gap-3 border-[#1f519c] px-3 py-2 rounded-md text-white hover:bg-white/10 transition ",
            isActive ? "  border-l-4  bg-white/20 font-semibold" : "opacity-80",
            isCollapsed ? "justify-center" : "justify-start"
          )
        }
        title={isCollapsed ? label : undefined}
      >
        {icon}
        {!isCollapsed && <span className="text-sm">{label}</span>}
      </NavLink>
    ))}
  </nav>
</motion.div>


            {/* p Bottom: Controls */}
            <div className="relative flex items-center justify-center py-4">
                <div className="flex flex-col gap-4 items-center  w-full px-3">
                    {/* 🌗 Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/20 transition"
                        title="Toggle Dark Mode"
                    >
                        <div className="relative w-12 h-6 flex justify-center items-center">
                            {/* Track */}
                            {!isCollapsed ? (
                                <>
                                    <div className="absolute  h-5 inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-30" />
                                    <motion.div
                                        className="absolute top-0 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center"
                                        animate={{
                                            x: isDarkMode ? "100%" : "-72%",
                                            transition: {
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30,
                                            },
                                        }}
                                    >
                                        {isDarkMode ? (
                                            <Moon
                                                size={16}
                                                className="text-blue-600"
                                            />
                                        ) : (
                                            <Sun
                                                size={16}
                                                className="text-yellow-500"
                                            />
                                        )}
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    {isDarkMode ? (
                                        <Moon
                                            size={16}
                                            className="text-blue-600"
                                        />
                                    ) : (
                                        <Sun
                                            size={16}
                                            className="text-yellow-500"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </button>

                    {/* 🚪 Logout */}
                    <button
                        // onClick={handleLogout}
                        onClick={onLogout}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-red-500 bg-red-400 dark:bg-red-800 text-black dark:text-white hover:scale-105 transition"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>

                <button
                    onClick={toggleSidebar}
                    className="absolute right-[10px] translate-x-full bg-white dark:bg-slate-800 text-black dark:text-white
                     p-1 rounded-full shadow-md hover:scale-105 transition-all"
                >
                    {isCollapsed ? (
                        <ChevronRight size={18} />
                    ) : (
                        <ChevronLeft size={18} />
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default AppSidebar;
