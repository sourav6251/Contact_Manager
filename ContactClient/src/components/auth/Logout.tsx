import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/UserSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import apiStore from "@/api/apiStore";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const response = await apiStore.logout();
            if (response === 200) {
                dispatch(logout());
                toast.success("Logged out successfully");
                navigate("/login");
            }
        };

        const timer = setTimeout(handleLogout, 2000); // Auto-redirect after 2 seconds

        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center"
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    Logging Out
                </h2>
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        You are being logged out...
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="border-gray-300 dark:border-gray-600"
                        >
                            Cancel Logout
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Logout;
