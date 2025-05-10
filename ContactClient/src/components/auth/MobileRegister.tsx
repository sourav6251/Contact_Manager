import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { InputOTPForm } from "./InputOTPForm";

const MobileRegister = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);
    const [otp, setOTP] = useState(false);
    const [register, setRegister] = useState({
        name: "",
        email: "",
        password: "",
        conformPassword: "",
    });
    const registerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegister({
            ...register,
            [e.target.id]: e.target.value,
        });
    };

    const submitRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            register.name.length < 0 ||
            register.email.length < 0 ||
            register.password.length < 0 ||
            register.conformPassword.length < 0
        ) {
            toast.error("All field are required");
            return;
        }
        setOTP(true);
        console.log(register);
    };

    return (
        <>
            {otp && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center  "
                    onClick={() => setOTP(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="  dark:bg-gray-800 rounded-xl  w-full max-w-md mx-4 bg-transparent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InputOTPForm email={register.email} onSuccess={() => setOTP(false)}/>
                    </motion.div>
                </motion.div>
            )}
            <form className="space-y-2" onSubmit={submitRegister}>
                <div>
                    <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Name
                    </Label>
                    <Input
                        id="name"
                        className="mt-1 h-10 w-full rounded-md bg-amber-50  focus:ring-transparent    px-3    "
                        value={register.name}
                        onChange={registerChange}
                    />
                </div>
                <div>
                    <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        className="mt-1 h-10 w-full rounded-md bg-amber-50  focus:ring-transparent      px-3    "
                        value={register.email}
                        onChange={registerChange}
                    />
                </div>
                <div>
                    <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Password
                    </Label>
                    <div className="flex">
                        <Input
                            id="password"
                            type={!showPassword ? "text" : "password"}
                            className="mt-1 h-10 w-full rounded-l-md bg-amber-50 px-3 focus:ring-transparent"
                            value={register.password}
                            onChange={registerChange}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            className="mt-1 h-10 rounded-r-md border border-l-0 bg-amber-50 px-3 hover:bg-amber-100"
                        >
                            {showPassword ? (
                                <EyeClosed className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <div>
                    <Label
                        htmlFor="conformPassword"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Confirm Password
                    </Label>
                    <div className="flex">
                        <Input
                            id="conformPassword"
                            type={!showConformPassword ? "text" : "password"}
                            className="mt-1 h-10 w-full rounded-l-md bg-amber-50 px-3 focus:ring-transparent"
                            value={register.conformPassword}
                            onChange={registerChange}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                                setShowConformPassword(!showConformPassword)
                            }
                            className="mt-1 h-10 rounded-r-md border border-l-0 bg-amber-50 px-3 hover:bg-amber-100"
                        >
                            {showConformPassword ? (
                                <EyeClosed className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <Button className="w-full bg-gradient-to-tl from-[#7CFFCBaa] to-[#089F8Fdd] dark:from-[#00C9A7] dark:to-[#045D5D]  text-white font-semibold rounded-md py-2 transition">
                    Sign Up
                </Button>
            </form>
            {register.password !== register.conformPassword && (
                <span className=" text-[13px] text-red-500  ">asdf</span>
            )}
        </>
    );
};

export default MobileRegister;
