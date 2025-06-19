import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import apiStore from "@/api/apiStore";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";
// import { useNavigate } from "react-router-dom";

interface updatePassword {
  currentPassword: string;
    newPassword: string;
}
const PasswordOld = () => {
  const userID:any=useSelector((state:RootState)=>state.user.userID)
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const password: updatePassword = { 
          currentPassword: formData.oldPassword,
            newPassword: formData.newPassword,
        };
        await apiStore.updateOldPassword(password,userID);
        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        // Handle successful password change
    };

    const passwordsMatch = formData.newPassword === formData.confirmPassword;
    const isFormValid =
        formData.oldPassword &&
        formData.newPassword.length >= 8 &&
        passwordsMatch;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4"
        >
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center mb-6">
                    {/* <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button> */}
                    <div className="flex items-center">
                        <Lock className="h-6 w-6 text-blue-500 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Change Password
                        </h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="oldPassword"
                            className="text-gray-700 dark:text-gray-300"
                        >
                            Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="oldPassword"
                                name="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="pr-10 h-11"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                onClick={() =>
                                    setShowOldPassword(!showOldPassword)
                                }
                            >
                                {showOldPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="newPassword"
                            className="text-gray-700 dark:text-gray-300"
                        >
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="pr-10 h-11"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Must be at least 8 characters long
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                    >
                        <Label
                            htmlFor="confirmPassword"
                            className="text-gray-700 dark:text-gray-300"
                        >
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="pr-10 h-11"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {formData.confirmPassword && !passwordsMatch && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-red-500"
                            >
                                Passwords don't match
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="pt-2"
                    >
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 hover:dark:bg-gray-900"
                            disabled={!isFormValid || isSubmitting}
                            
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default PasswordOld;
