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
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-200 dark:border-blue-800 shadow-lg"
    />

    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        {contactData.name}
    </h2>

    <p className="text-gray-600 dark:text-gray-300 mb-1">
        <a
            href={`mailto:${contactData.email}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
        >
            {contactData.email}
        </a>
    </p>

    <p className="text-gray-600 dark:text-gray-300 mb-4">
        <a
            href={`tel:${contactData.phone}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
        >
            {contactData.phone}
        </a>
    </p>

    <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
            onClick={() => toast.success("Contact shown successfully!")}
            className="w-full sm:w-1/2 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all"
        >
            Done
        </button>

        <button
            onClick={() => navigate("/home")}
            className="w-full sm:w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
        >
            Go to Home
        </button>
    </div>
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
