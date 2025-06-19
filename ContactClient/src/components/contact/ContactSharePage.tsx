import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import apiStore from "@/api/apiStore";

interface ContactData {
    name: string;
    email: string;
    phone: string;
    profilePic: string;
}

const ContactSharePage: React.FC = () => {
    const [otp, setOtp] = useState<string>("");
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [contactData, setContactData] = useState<ContactData | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { contactId } = useParams<string>();
    const navigate = useNavigate();

    const handleOtpChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value.replace(/\D/g, "");
        const newOtp = otp.split("");
        newOtp[index] = value;
        setOtp(newOtp.join(""));

        if (value && index < 5 && e.target.nextSibling) {
            (e.target.nextSibling as HTMLInputElement).focus();
        } else if (!value && index > 0 && e.target.previousSibling) {
            (e.target.previousSibling as HTMLInputElement).focus();
        }

        setError("");
    };

    useEffect(() => {
        const isValidUUID = (id: string) => {
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return uuidRegex.test(id);
        };

        if (!contactId || !isValidUUID(contactId)) {
            toast.error("URL is not correct");
            navigate("/contact/sharen");
        } else {
            toast.info(`Contact ID: ${contactId}`);
        }
    }, [contactId]);

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP");
            return;
        }

        if (!contactId) {
            toast.error("Invalid URL");
            navigate("/contact/sharen");
            return;
        }

        setIsLoading(true);
        try {
            const contact = await apiStore.verifyShareContact(contactId, otp);
            setContactData({
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                profilePic: contact.mediaUrl,
            });
            setIsVerified(true);
        } catch (err) {
            // Handled inside apiStore
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                >
                    {isVerified && contactData ? (
                        <div className="text-center">
                            <img
                                src={contactData.profilePic}
                                alt="Profile"
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                {contactData.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                <a
                                    href={`mailto:${contactData.email}`}
                                    className="hover:underline text-blue-500"
                                >
                                    {contactData.email}
                                </a>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                <a
                                    href={`tel:${contactData.phone}`}
                                    className="hover:underline text-blue-500"
                                >
                                    {contactData.phone}
                                </a>
                            </p>
                            <button
                                onClick={() =>
                                    toast.success("Contact shown successfully!")
                                }
                                className="mt-6 w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Verify Your Identity
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Enter the 6-digit code sent to your device
                                </p>
                            </div>

                            <form onSubmit={verifyOtp} className="space-y-6">
                                <div className="flex justify-center gap-2 mb-6">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={otp[i] || ""}
                                            onChange={(e) =>
                                                handleOtpChange(e, i)
                                            }
                                            className="w-12 h-16 text-3xl text-center font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            autoFocus={i === 0}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="text-center text-red-500 dark:text-red-400 text-sm animate-shake">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className={`w-full py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                                        isLoading || otp.length !== 6
                                            ? "bg-blue-300 dark:bg-blue-700 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50"
                                    }`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
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
                                            Verifying...
                                        </span>
                                    ) : (
                                        "Verify & Continue"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ContactSharePage;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import apiStore from "@/api/apiStore";

// interface ContactData {
//     name: string;
//     email: string;
//     phone: string;
//     profilePic: string;
// }

// const ContactSharePage: React.FC = () => {
//     const [otp, setOtp] = useState<string>("");
//     const [isVerified, setIsVerified] = useState<boolean>(false);
//     const [contactData, setContactData] = useState<ContactData | null>(null);
//     const [error, setError] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const { contactId } = useParams<string>();
//     const navigate = useNavigate();
//     const handleOtpChange = (
//         e: React.ChangeEvent<HTMLInputElement>,
//         index: number
//     ) => {
//         const value = e.target.value.replace(/\D/g, ""); // Allow only digits

//         if (value) {
//             // Update the OTP at the specific index
//             const newOtp = otp.split("");
//             newOtp[index] = value;
//             setOtp(newOtp.join(""));

//             // Auto-focus to next input if available
//             if (index < 5 && e.target.nextSibling) {
//                 (e.target.nextSibling as HTMLInputElement).focus();
//             }
//         } else {
//             // Handle backspace/delete
//             const newOtp = otp.split("");
//             newOtp[index] = "";
//             setOtp(newOtp.join(""));

//             // Auto-focus to previous input if available
//             if (index > 0 && e.target.previousSibling) {
//                 (e.target.previousSibling as HTMLInputElement).focus();
//             }
//         }

//         setError("");
//     };

//     useEffect(() => {
//         const isValidUUID = (id: string) => {
//             const uuidRegex =
//                 /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//             return uuidRegex.test(id);
//         };

//         if (!contactId || !isValidUUID(contactId)) {
//             toast.error("URL is not correct ");
//             navigate("/contact/sharen");
//             return;
//         }
//         toast.info(`Contact ID: ${contactId}`);
//     }, [contactId]);

//     // useEffect(() => {
//     //     let timer: NodeJS.Timeout;
//     //     if (resendDisabled && resendTimer > 0) {
//     //         timer = setInterval(() => {
//     //             setResendTimer(prev => prev - 1);
//     //         }, 1000);
//     //     } else if (resendTimer === 0) {
//     //         setResendDisabled(false);
//     //         setResendTimer(30);
//     //     }
//     //     return () => clearInterval(timer);
//     // }, [resendDisabled, resendTimer]);

//     const verifyOtp = async (e: React.FormEvent) => {
//         e.preventDefault();
//         // toast.info(otp);
//         if (otp.length !== 6) {
//             setError("Please enter a 6-digit OTP");
//             return;
//         }

//         if (!contactId) {
//             toast.error("URL is not correct ");
//             navigate("/contact/sharen");
//             return;
//         }
//         setIsLoading(true);
//         try {
//             await apiStore.verifyShareContact(contactId, otp);
//         } catch (err) {}finally{

//             setIsLoading(false);
//         }

//     };

//     // const resendOtp = () => {
//     //     setResendDisabled(true);
//     //     setResendTimer(30);
//     //     toast.info("New OTP has been sent to your device");
//     //     // In a real app, you would call your API to resend OTP here
//     // };

//     //     const saveContact = () => {
//     //         if (!contactData) return;

//     //         // Create a vCard string
//     //         const vCard = `
//     // BEGIN:VCARD
//     // VERSION:3.0
//     // FN:${contactData.name}
//     // EMAIL:${contactData.email}
//     // TEL:${contactData.phone}
//     // PHOTO:${contactData.profilePic}
//     // END:VCARD
//     //         `.trim();

//     //         // Create a Blob and trigger download
//     //         const blob = new Blob([vCard], { type: "text/vcard" });
//     //         const url = URL.createObjectURL(blob);
//     //         const a = document.createElement("a");
//     //         a.href = url;
//     //         a.download = `${contactData.name.replace(/\s+/g, '_')}.vcf`;
//     //         document.body.appendChild(a);
//     //         a.click();
//     //         document.body.removeChild(a);
//     //         URL.revokeObjectURL(url);

//     //         toast.success("Contact saved successfully!");
//     //     };

//     return (
//         <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
//             <div className="w-full max-w-md">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700"
//                 >
//                     <div className="text-center mb-8">
//                         <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <svg
//                                 className="w-8 h-8 text-blue-600 dark:text-blue-400"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
//                                 />
//                             </svg>
//                         </div>
//                         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
//                             Verify Your Identity
//                         </h2>
//                         <p className="text-gray-600 dark:text-gray-300">
//                             Enter the 6-digit code sent to your device
//                         </p>
//                     </div>

//                     <form onSubmit={verifyOtp} className="space-y-6">
//                         <div className="flex justify-center gap-2 mb-6">
//                             {[0, 1, 2, 3, 4, 5].map((i) => (
//                                 <input
//                                     key={i}
//                                     type="text"
//                                     inputMode="numeric"
//                                     maxLength={1}
//                                     value={otp[i] || ""}
//                                     onChange={(e) => handleOtpChange(e, i)}
//                                     className="w-12 h-16 text-3xl text-center font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     autoFocus={i === 0}
//                                 />
//                             ))}
//                         </div>

//                         {error && (
//                             <div className="text-center text-red-500 dark:text-red-400 text-sm animate-shake">
//                                 {error}
//                             </div>
//                         )}

//                         <button
//                             type="submit"
//                             disabled={isLoading || otp.length !== 6}
//                             className={`w-full py-3 rounded-xl text-white font-medium transition-all duration-300 ${
//                                 isLoading || otp.length !== 6
//                                     ? "bg-blue-300 dark:bg-blue-700 cursor-not-allowed"
//                                     : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50"
//                             }`}
//                         >
//                             {isLoading ? (
//                                 <span className="flex items-center justify-center gap-2">
//                                     <svg
//                                         className="animate-spin h-5 w-5 text-white"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <circle
//                                             className="opacity-25"
//                                             cx="12"
//                                             cy="12"
//                                             r="10"
//                                             stroke="currentColor"
//                                             strokeWidth="4"
//                                         ></circle>
//                                         <path
//                                             className="opacity-75"
//                                             fill="currentColor"
//                                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                         ></path>
//                                     </svg>
//                                     Verifying...
//                                 </span>
//                             ) : (
//                                 "Verify & Continue"
//                             )}
//                         </button>
//                     </form>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default ContactSharePage;

// OTP Verification Form
{
    /* <motion.div 
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700"
>
<div className="text-center mb-8">
    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
    </div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Verify Your Identity
    </h2>
    <p className="text-gray-600 dark:text-gray-300">
        Enter the 6-digit code sent to your device
    </p>
</div>

<form onSubmit={verifyOtp} className="space-y-6">
    <div className="flex justify-center gap-2 mb-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[i] || ''}
                onChange={(e) => handleOtpChange(e, i)}
                className="w-12 h-16 text-3xl text-center font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus={i === 0}
            />
        ))}
    </div>

    {error && (
        <div className="text-center text-red-500 dark:text-red-400 text-sm animate-shake">
            {error}
        </div>
    )}

    <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className={`w-full py-3 rounded-xl text-white font-medium transition-all duration-300 ${
            isLoading || otp.length !== 6
                ? 'bg-blue-300 dark:bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50'
        }`}
    >
        {isLoading ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
            </span>
        ) : (
            'Verify & Continue'
        )}
    </button>

    <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        Didn't receive code?{' '}
        <button
            type="button"
            onClick={resendOtp}
            disabled={resendDisabled}
            className={`font-medium ${
                resendDisabled
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            }`}
        >
            {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}
        </button>
    </div>
</form>
</motion.div> */
}
// data show card after verification
{
    /* <motion.div
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.3 }}
className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700"
>
<div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden shadow-lg">
            <img
                src={contactData.profilePic}
                alt={contactData.name}
                className="w-full h-full object-cover"
            />
        </div>
    </div>
</div>

<div className="pt-16 pb-8 px-6 text-center">
    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        {contactData.name}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
        Shared Contact
    </p>

    <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <a
                href={`mailto:${contactData.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
                {contactData.email}
            </a>
        </div>

        <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            </div>
            <div className="flex items-center gap-2">
                <a
                    href={`tel:${contactData.phone}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {contactData.phone}
                </a>
                <button
                    onClick={saveContact}
                    className="text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Save
                </button>
            </div>
        </div>
    </div>

    <button
        onClick={() => setIsVerified(false)}
        className="mt-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
    >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to verification
    </button>
</div>
</motion.div> */
}
