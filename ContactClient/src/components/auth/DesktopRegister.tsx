import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { InputOTPForm } from "./InputOTPForm";
import apiStore from "@/api/apiStore";

const DesktopRegister = () => {
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

    const submitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !register.name ||
            !register.email ||
            !register.password ||
            !register.conformPassword
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            const status = await apiStore.register(
                register.name,
                register.email,
                register.password
            );
            if (status === 200) {
                await apiStore.generateOTP(register.email);
                setOTP(true);
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            {otp && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={() => setOTP(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="rounded-xl w-full max-w-md mx-4 bg-background"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InputOTPForm email={register.email} onSuccess={() => setOTP(false)} />
                    </motion.div>
                </motion.div>
            )}

            <h2 className="text-2xl font-bold">Welcome</h2>
            <p className="text-sm text-muted-foreground">Create account to continue</p>
            <form className="space-y-1.5" onSubmit={submitRegister}>
                <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                        Name
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        className="h-8 w-full"
                        required
                        value={register.name}
                        onChange={registerChange}
                    />
                </div>
                <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        className="h-8 w-full"
                        required
                        value={register.email}
                        onChange={registerChange}
                    />
                </div>
                <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                        Password
                    </Label>
                    <div className="flex">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="h-8 w-full rounded-l-md rounded-r-none border-r-0"
                            required
                            value={register.password}
                            onChange={registerChange}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            className="h-8 rounded-r-md rounded-l-none border border-l-0"
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
                    <Label htmlFor="conformPassword" className="text-sm font-medium">
                        Confirm Password
                    </Label>
                    <div className="flex">
                        <Input
                            id="conformPassword"
                            type={showConformPassword ? "text" : "password"}
                            className="h-8 w-full rounded-l-md rounded-r-none border-r-0"
                            required
                            value={register.conformPassword}
                            onChange={registerChange}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowConformPassword(!showConformPassword)}
                            className="h-8 rounded-r-md rounded-l-none border border-l-0"
                        >
                            {showConformPassword ? (
                                <EyeClosed className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {register.password !== register.conformPassword && (
                        <span className="text-[13px] text-destructive">
                            Passwords do not match
                        </span>
                    )}
                </div>

                <Button className="w-full mt-3 font-semibold rounded-md py-2 transition">
                    Sign Up
                </Button>
            </form>
        </>
    );
};

export default DesktopRegister;
