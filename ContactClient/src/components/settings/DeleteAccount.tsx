import { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import apiStore from "@/api/apiStore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/UserSlice";

const DeleteAccount = () => {
    const userID = useSelector((state: RootState) => state.user.userID);
    const dispatch=useDispatch();
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const handleOtpChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };
    const navigate = useNavigate();
    const sendOTP = async () => {
        setLoading(true);
        await apiStore.generateOTP(userID, "deleteAccount");
        setShowOtpInput(true);
        setLoading(false);
    };
    const handleDeleteConfirm = async () => {
        const enteredOtp = otp.join("");
        console.log("enteredOtp=>", enteredOtp);

        if (enteredOtp.length === 6) {
            const response = await apiStore.verifyOTP(userID, enteredOtp);
            console.log("response=>",response);
            
            if (response === "success") {
                const response1 = await apiStore.deleteAccount(userID);
                if (response1 === "success") {
                  dispatch(logout())
                    navigate("/");
                }
            }
            // alert(`OTP entered: ${enteredOtp}\nAccount will be deleted.`);
            // TODO: API call for deletion
        } else {
            alert("Please enter a 6-digit OTP.");
        }
    };

    return (
        <div className="min-h-full pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-700"
            >
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full">
                        <Trash className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
                        Confirm Account Deletion
                    </h2>

                    {!showOtpInput ? (
                        <>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md">
                                This action is irreversible. All your data will
                                be permanently removed. Are you absolutely sure
                                you want to delete your account?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Button
                                    // onClick={() => {
                                    //   setShowOtpInput(true);
                                    //   // Optional: trigger OTP send API
                                    // }}
                                    onClick={sendOTP}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {!loading ? (
                                        <span>Yes, Delete</span>
                                    ) : (
                                        <span>Sending otp ....</span>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="text-gray-600 dark:text-gray-300"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md">
                                Enter the 6-digit OTP sent to your email or
                                phone to confirm deletion.
                            </p>
                            <div className="flex space-x-2">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleOtpChange(e.target.value, idx)
                                        }
                                        className="w-10 h-12 text-center text-lg border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                ))}
                            </div>
                            <div className="flex justify-center space-x-4">
                                <Button
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Confirm Deletion
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowOtpInput(false);
                                        setOtp(["", "", "", "", "", ""]);
                                    }}
                                    className="text-gray-600 dark:text-gray-300"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteAccount;
