import apiStore from "@/api/apiStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RootState } from "@/redux/SliceStore"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"

const PasswordOTP = () => {
  const userID:any=useSelector((state:RootState)=>state.user.userID);
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState< "otp" | "password">("otp")
  const [isLoading, setIsLoading] = useState(false)
  const [otpGenerate,setOTPGenerate]=useState(false)
  const [countdown, setCountdown] = useState(0)


  const generateOTP=async()=>{
    setOTPGenerate(true)
    setCountdown(40); 
    await apiStore.generateOTP(userID)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setOTPGenerate(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerifyOtp = async () => {
    setIsLoading(true)
   const response= await apiStore.verifyOTP(userID,otp)

    setIsLoading(false)
    if (response==="success") {
      setOtp("")
      setStep("password")
    }

  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.success("Please make sure both passwords match.")
      return
    }

    setIsLoading(true)
    // Simulate password reset API call
    const response= await apiStore.updatePassword(newPassword,userID)
    setIsLoading(false)
    toast.success( "Your password has been successfully updated.")   
     if (response==="success") {
      setStep("otp")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

      <div className="flex items-center mb-6">
        <Lock className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Reset Password via OTP
        </h2>
      </div>

   

      {step === "otp" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-gray-700 dark:text-gray-300">
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
  disabled={otpGenerate}
  className="whitespace-nowrap text-sm font-semibold px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 hover:dark:bg-gray-900"
>
  {otpGenerate ? `Try again in ${countdown}s` : "Generate OTP"}
</Button>

</div>

          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleVerifyOtp}
              className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 hover:dark:bg-gray-900"
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      )}

      {step === "password" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500">Passwords don't match</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep("otp")}
            >
              Back
            </Button>
            <Button
              onClick={handleResetPassword}
              className="flex-1"
              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default PasswordOTP