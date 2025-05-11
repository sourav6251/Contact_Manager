import { RootState } from "@/redux/SliceStore";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import apiStore from "@/api/apiStore";
import { Skeleton } from "../ui/skeleton";

const ProfilePage = () => {
    const userID:any = useSelector((state: RootState) => state.user.userID);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        isVerified: false,
        mediaUrl: "",
        totalContact: 0,
    });
    let profile;

    const feathProfile = async () => {
        profile = await apiStore.featchProfile(userID);
        console.log("profile=>",profile);
        
        setUserData({
            name: profile?.user.name,
            email: profile?.user.email,
            mediaUrl: profile?.user.mediaUrl,
            isVerified: profile?.user.verify,
            totalContact: profile?.totalContacts,
        });
        console.log("userData=>", userData);
    };
    useEffect(() => {
        feathProfile();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#89F7FEaa] to-[#66A6FFdd] dark:from-[#00B4D8] dark:to-[#0077B6] flex items-center justify-around p-4">
            {!profile ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    // whileHover={{ scale: 1.02 }}
                    transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200,
                    }}
                    className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-tr from-[#66A6FF] to-[#89F7FE] dark:from-[#00B4D8] dark:to-[#0077B6] p-6 text-center relative">
                        {/* Spinning Ring Animation */}
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                repeat: Infinity,
                                duration: 20,
                                ease: "linear",
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-36 h-36 rounded-full border-2 border-dashed border-white/50" />
                        </motion.div>

                        {/* Profile Picture */}
                        <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden shadow-md">
                            <img
                                src={userData.mediaUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-10 pb-6 px-6 text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {userData.name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {userData.email}
                        </p>

                        {/* Verification Badge */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex justify-center"
                        >
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    userData.isVerified
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                                }`}
                            >
                                {userData.isVerified ? (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                ) : (
                                    <XCircle className="h-4 w-4 mr-1" />
                                )}
                                {userData.isVerified
                                    ? "Verified"
                                    : "Not Verified"}
                            </span>
                        </motion.div>
                    </div>

                    {/* Footer - Contacts Only */}
                    <div className="bg-gray-100 dark:bg-gray-700/50 p-4 text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-bold text-gray-800 dark:text-white text-xl"
                        >
                            {userData.totalContact}
                        </motion.p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                            Contacts
                        </p>
                    </div>
                </motion.div>
            ) : (
                <>
                    <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-tr from-[#66A6FF] to-[#89F7FE] dark:from-[#00B4D8] dark:to-[#0077B6] p-6 text-center relative">
                            <Skeleton className="relative mx-auto w-28 h-28 rounded-full  shadow-md"></Skeleton>
                        </div>

                        <div className="pt-10 pb-6 px-6 flex flex-col rounded-full items-center text-center space-y-4">
                            <Skeleton className="text-2xl h-[1.5rem] w-[10rem] font-bold bg-gray-200"></Skeleton>
                            <Skeleton className="text-2xl h-[1.5rem] w-[13rem] font-bold bg-gray-200"></Skeleton>

                            <Skeleton className="text-2xl h-[1.5rem] w-[5rem] font-bold bg-gray-200"></Skeleton>
                        </div>
                        <div className="bg-gray-100 gap-y-2 dark:bg-gray-700/50 p-4 text-center flex flex-col items-center justify-center">
                            <Skeleton className="text-2xl h-[1.1rem] w-[5rem] font-bold bg-gray-200"></Skeleton>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Contacts
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
