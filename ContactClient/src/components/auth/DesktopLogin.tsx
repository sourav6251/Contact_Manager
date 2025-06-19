import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import apiStore from "@/api/apiStore";
import { useDispatch } from "react-redux";
import { login, loginStatus } from "@/redux/UserSlice";
import { useNavigate } from "react-router-dom";

const DesktopLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [loading,setLoading]=useState(false)


    const loginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.id]: e.target.value,
        });
    };

    const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast.error("All fields are required");
            return;
        }
        try {
            const response = await apiStore.login(loginData.email, loginData.password);
            if (response?.status===200) {
                dispatch(loginStatus(true));
                dispatch(login({
                    login: true,
                    userID: response?.data.userId,
                    darkmode: false, 
                    userName:response?.data.name
                }));
            }
            console.log(response);
          
            console.log(`UseName=>`,response?.data.name);
            // console.log(response );
            
            navigate("/");
        } catch {
            toast.error("Login failed");
        }
        setLoading(false)
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-2">Welcome</h2>
            <p className="text-sm text-muted-foreground mb-6">
                Login in to your account to continue
            </p>
            <form className="space-y-5" onSubmit={submitLogin}>
                <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        className="mt-1 h-10 w-full"
                        required
                        value={loginData.email}
                        onChange={loginChange}
                    />
                </div>
                <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                        Password
                    </Label>
                    <div className="flex">
                        <Input
                            id="password"
                            type={!showPassword ? "text" : "password"}
                            className="mt-1 h-10 w-full rounded-r-none"
                            required
                            value={loginData.password}
                            onChange={loginChange}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            className="mt-1 h-10 rounded-l-none"
                        >
                            {showPassword ? (
                                <EyeClosed className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <div className="text-right text-sm">
                    <span
                        onClick={() => alert("hi")}
                        className="hover:cursor-pointer hover:underline"
                    >
                        Forgot your password?
                    </span>
                </div>
                <Button className="w-full font-semibold rounded-md py-2 transition">
                {loading ? <> Loging ......</>:<>LOG IN</>}
                    
                </Button>
            </form>
        </>
    );
};

export default DesktopLogin;
