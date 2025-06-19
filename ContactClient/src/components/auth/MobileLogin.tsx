import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";

const MobileLogin = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const loginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.id]: e.target.value,
        });
    };


    const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loginData.email.length == 0 || loginData.password.length == 0) {
            toast.error("All field are required");
            return;
        }
        console.log(loginData);
    };

    return (
        <>


            <form className="space-y-5 " onSubmit={submitLogin}>
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
                        className="mt-1 h-10 w-full rounded-md bg-amber-50 dark:     px-3  focus:ring-transparent  "
                        required
                        value={loginData.email}
                        onChange={loginChange}
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
                            type={showPassword ? "text" : "password"}
                            className="mt-1 h-10 w-full rounded-l-md bg-amber-50 px-3 focus:ring-transparent"
                            value={loginData.password}
                            onChange={loginChange}
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
                <Button className="w-full bg-gradient-to-l from-[#7CFFCBaa] to-[#089F8Fdd] dark:from-[#00C9A7] dark:to-[#045D5D]  text-white font-semibold rounded-md py-2 transition">
                    Sign In
                </Button>
            </form>
            <p className="self-end" onClick={() => {}}>
                Forgot Password ?
            </p>
            {/* <p className="text-center text-sm text-gray-600 dark:text-black">
                Don't have an account?{" "}
                <span
                    onClick={() => setSign("signup")}
                    className="text-[#7CFFCBaa] dark:text-[#045D5D]   hover:underline cursor-pointer font-medium"
                >
                    Sign Up
                </span>
            </p> */}
        </>
    );
};

export default MobileLogin;
