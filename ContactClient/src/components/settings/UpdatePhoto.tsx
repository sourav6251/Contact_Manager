import { Label } from "recharts";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import apiStore from "@/api/apiStore";
import { RootState } from "@/redux/SliceStore";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const UpdatePhoto = () => {
    const userID: string | null = useSelector(
        (state: RootState) => state.user.userID
    );
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpGenerate, setOTPGenerate] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [sendOTP, setSendOTP] = useState(false);
    const [isVerified, setIsVerfied] = useState(false);
    const generateOTP = async () => {
        console.log("isVerified=> ",isVerified);
        
        if (isVerified) {
            alert("You aready verified");
        } else {
            setSendOTP(true)
            setOTPGenerate(true);
            setCountdown(40);
            await apiStore.generateOTP(userID, "verifyProfile");
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setOTPGenerate(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            // setSendOTP(false)
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        const response = await apiStore.verifyOTP(userID, otp);

        setIsLoading(false);
        if (response === "success") {
            setOtp("");
        }
    };

    const checkIsVerified = async () => {
        const response = await apiStore.isVerifiedUser(userID);
        console.log("checkIsVerified=> ", response);

        setIsVerfied(response);
    };

    useEffect(() => {
        checkIsVerified();
    }, []);

    return (
        <div className="space-y-4 pt-16">
            <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                    Enter OTP
                </Label>
                <div className="w-full  p-2 rounded-md flex items-center gap-2">
                    <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="flex-1 text-center text-lg font-mono tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={6}
                        required
                    />
                    <Button
                        onClick={generateOTP}
                        // disabled={true}
                        // disabled={otpGenerate}
                        className="whitespace-nowrap text-sm font-semibold px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 hover:dark:bg-gray-900"
                    >
                        {otpGenerate
                            ? `Try again in ${countdown}s`
                            : "Generate OTP"}
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={handleVerifyOtp}
                    className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 hover:dark:bg-gray-900"
                    disabled={(otp.length !== 6 || isLoading)|| !sendOTP}
                    
                >
                    {isLoading ? "Verifying..." : "Verify"}
                </Button>
            </div>
        </div>
    );
};

export default UpdatePhoto;
