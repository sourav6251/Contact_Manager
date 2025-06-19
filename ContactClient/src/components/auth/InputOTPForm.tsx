import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import apiStore from "@/api/apiStore";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";
import { log } from "util";

// Define props interface
interface InputOTPFormProps {
    email: string;
    onSuccess: () => void;
}

const FormSchema = z.object({
    pin: z
        .string()
        .min(6, {
            message: "Your one-time password must be 6 digits.",
        })
        .regex(/^\d+$/, {
            message: "Only numbers are allowed",
        }),
});

export function InputOTPForm({ email ,onSuccess}: InputOTPFormProps) {
    const userID=useSelector((state:RootState)=>state.user.userID)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { pin: "" },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            console.log("userID=>",userID)
            await apiStore.verifyOTP(userID, data.pin);
            onSuccess(); 
        } catch {
            toast.error("Enter valied otp");
        }
        // Navigate();

        toast.success("Verification successful!");
    }

    const handleInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "e" || e.key === "+" || e.key === "-" || e.key === ".") {
            e.preventDefault();
        }
    };

    return (
        <div className="flex items-center justify-center bg-transparent">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#089F8F] to-[#00C9A7] bg-clip-text text-transparent dark:from-[#7CFFCB] dark:to-[#00C9A7]">
                                Verify Your Account
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Enter the 6-digit code sent to {email}
                            </p>
                        </div>

                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                        Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            onKeyDown={handleInputChange}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {[...Array(6)].map(
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="w-12 h-14 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-xl font-semibold 
                                      bg-white dark:bg-slate-800 transition-all hover:border-[#089F8F] 
                                      focus-visible:ring-2 focus-visible:ring-[#00C9A7] focus-visible:ring-offset-2"
                                                        />
                                                    )
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription className="text-center text-slate-500 dark:text-slate-400 text-sm">
                                        Can't find the code? Check your spam
                                        folder or{" "}
                                        <button
                                            type="button"
                                            className="text-[#089F8F] dark:text-[#7CFFCB] hover:underline"
                                        >
                                            request a new code
                                        </button>
                                        .
                                    </FormDescription>
                                    <FormMessage className="text-red-600 dark:text-red-400 text-sm" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full py-6 text-lg font-semibold bg-[#089F8F] hover:bg-[#00C9A7] transition-all 
                        text-white shadow-lg hover:shadow-[#089F8F]/30 dark:bg-[#00C9A7] dark:hover:bg-[#7CFFCB]"
                        >
                            Verify Account
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
