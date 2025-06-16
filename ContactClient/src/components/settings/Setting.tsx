import { useState } from "react";
import { Button } from "@/components/ui/button";
import UpdatePhoto from "./VerifyProfile";
import PasswordOld from "./PasswordOld";
import PasswordOTP from "./PasswordOTP";
import UpdateName from "./UpdateProfile";
import {
  Settings,
  User,
  Lock,
  Smartphone,
  ChevronRight,
  CheckCircle,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DeleteAccount from "./DeleteAccount";

const Setting = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const renderForm = () => {
    switch (selectedOption) {
      case "verified":
        return <UpdatePhoto />;
      case "passwordOld":
        return <PasswordOld />;
      case "passwordOTP":
        return <PasswordOTP />;
      case "changeName":
        return <UpdateName />;
      case "deleteAccount":
        return <DeleteAccount/>;
      default:
        return ( 
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-full">
                <Settings className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Account Settings
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Select an option from the sidebar to update your account
                information, security settings, or profile details.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  const menuItems = [
    {
      id: "verified",
      title: "Verify Profile",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      id: "changeName",
      title: "Change Name",
      icon: <User className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/30",
    },
    {
      id: "passwordOld",
      title: "Update Password",
      description: "Using current password",
      icon: <Lock className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      id: "passwordOTP",
      title: "Update Password",
      description: "Via OTP verification",
      icon: <Smartphone className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      id: "deleteAccount",
      title: "Delete Account",
      description: "Permanently remove your account",
      icon: <Trash className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-sm md:text-base">
      {/* Mobile Dropdown */}
      <div className="md:hidden sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 pt-16 pb-4 px-4">
        <div className="relative">
          <div className="relative">
            <select
              className="w-full py-3 pl-4 pr-10 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={selectedOption || ""}
              onChange={(e) => setSelectedOption(e.target.value || null)}
            >
              <option value="" className="text-gray-400">
                Select a setting...
              </option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                  {item.description ? ` (${item.description})` : ""}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
              <ChevronRight className="h-5 w-5 rotate-90 transition-transform duration-200" />
            </div>
          </div>

          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end mt-2 space-x-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOption(null)}
                className="text-gray-500 dark:text-gray-400"
              >
                Back
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex w-full md:w-72 lg:w-80 p-6 border-r dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl">
        <div className="w-full space-y-4">
          <div className="px-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account preferences
            </p>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedOption(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                  selectedOption === item.id
                    ? `${item.bgColor} border border-gray-200 dark:border-gray-700 shadow-lg ring-1 ring-inset ring-white/10`
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <span
                  className={`p-2 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/60 to-white/20 dark:from-gray-800 dark:to-gray-700 backdrop-blur-sm shadow-inner ${item.color}`}
                >
                  {item.icon}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedOption || "default"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            {renderForm()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Setting;