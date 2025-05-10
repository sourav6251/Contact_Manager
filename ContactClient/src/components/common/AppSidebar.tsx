import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Sun, LogOut, CircleUserRound,  BookUser, Settings, Tags } from "lucide-react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { RootState } from "@/redux/SliceStore";

const links=[
    { to: "/profile", label: "Profile", icon: <CircleUserRound size={20} /> },
    { to: "/contacts", label: "Contacts", icon: <BookUser size={20} /> },
    { to: "/tags", label: "Tags", icon: <Tags size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ]

const AppSidebar = ({
    isDarkMode = false,
    toggleDarkMode,
    isCollapsed = false,
    toggleSidebar,
    onLogout
}) => {
    const userName: String | null = useSelector(
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
                        src="/vite.svg"
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

// import { logout } from "@/redux/UserSlice";
// import { Switch } from "@radix-ui/react-switch";
// import { ChevronLeft, ChevronRight, Home, LogOut, Moon, Settings, Sun, Tags, User } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { NavLink, useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// import { motion } from "framer-motion";

//   const SidebarLink = ({ icon: Icon, label, isCollapsed, to }) => {

//   return (
//     <NavLink to={to}>

//           {({ isActive }) => (
//               <motion.div
//                   className={`w-full relative flex flex-row h-10 items-center justify-start rounded-md transition-colors duration-200
//                       ${
//                           isActive
//                               ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                               : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
//                       }
//                       ${isCollapsed ? "justify-center rounded-lg" : "px-5"}
//                   `}
//                   initial={false}
//                   animate={{
//                       backgroundColor: isActive ? "" : "transparent",
//                   }}
//                   transition={{ duration: 0.2 }}
//               >
//                   {isActive && (
//                       <motion.div
//                           layoutId="activeIndicator"
//                           className="absolute left-0 w-1 h-full dark:bg-slate-200 bg-slate-800 rounded"
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           exit={{ opacity: 0 }}
//                           transition={{ duration: 0.3 }}
//                       />
//                   )}

//                   <motion.div
//                       animate={{
//                           marginRight: isCollapsed ? 0 : 8,
//                           scale: isActive ? 1.1 : 1,
//                       }}
//                       transition={{ duration: 0.3 }}
//                   >
//                       <Icon className="h-5 w-5 text-xl" size={24} />
//                   </motion.div>

//                   {!isCollapsed && (
//                       <motion.span
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: -10 }}
//                           transition={{ duration: 0.3 }}
//                       >
//                           {label}
//                       </motion.span>
//                   )}
//               </motion.div>
//           )}
//       </NavLink>
//   );
// };

// const AppSidebar = ({
//   isDarkMode = false,
//   toggleDarkMode,
//   isCollapsed = false,
//   toggleSidebar,
// }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   const sidebarVariants = {
//     expanded: { width: 240 },
//     collapsed: { width: 80 },
//   };

//   const menuItems = [
//     { to: "/", label: "Home", icon: Home },
//     { to: "/contactmanager", label: "Contacts", icon: User },
//     { to: "/favourite", label: "Favourite", icon: Tags },
//     { to: "/setting", label: "Setting", icon: Settings },
//   ];

//   return (
//     <motion.div
//       variants={sidebarVariants}
//       initial={false}
//       animate={isCollapsed ? "collapsed" : "expanded"}
//       transition={{ duration: 0.3 }}
//       className="h-screen pt-10 sticky top-0 bg-gradient-to-tr from-[#89F7FEaa] to-[#66A6FFdd] dark:from-[#00B4D8] dark:to-[#0077B6] text-white border-r shadow-xl flex flex-col justify-between"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 h-16">
//         {!isCollapsed && (
//           <motion.div className="text-lg font-bold">PhoneBook</motion.div>
//         )}
//         <button onClick={toggleSidebar}>
//           {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//         </button>
//       </div>

//       {/* Links */}
//       <div className="flex-1  space-y-2">
//         {menuItems.map((item) => (
//           <SidebarLink
//             key={item.to}
//             to={item.to}
//             label={item.label}
//             icon={item.icon}
//             isCollapsed={isCollapsed}
//           />
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="p-2 space-y-2">
//         <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-2`}>
//           <Switch
//             checked={isDarkMode}
//             onCheckedChange={toggleDarkMode}
//             className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/30 transition-colors"
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                 isDarkMode ? "translate-x-6" : "translate-x-1"
//               }`}
//             >
//               {isDarkMode ? <Moon className="h-3 w-3 text-[#0077B6]" /> : <Sun className="h-3 w-3 text-[#66A6FF]" />}
//             </span>
//           </Switch>
//           {!isCollapsed && <span className="text-sm">{isDarkMode ? "Dark" : "Light"}</span>}
//         </div>

//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-red-500/80 hover:bg-red-600 text-white rounded-md transition"
//         >
//           <LogOut className="w-4 h-4" />
//           {!isCollapsed && "Logout"}
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default AppSidebar;
