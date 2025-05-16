import { useEffect, useRef } from "react";
import { PageWrapper } from "../layout/PageWrapper";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";
import { X } from "lucide-react";
import { logout } from "@/redux/UserSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import apiStore from "@/api/apiStore";

interface LogoutPopupProps {
    onClose: () => void;
}

const LogoutPopup = ({ onClose }: LogoutPopupProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const userName = useSelector((state: RootState) => state.user.userName);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const pageVariants = {
        initial: { opacity: 0, scale: 0.95, y: -520 },
        animate: { opacity: 1, scale: 1, x: 0, y: 0 },
        exit: { opacity: 0, scale: 0.95, x: -300 },
    };

    const pageTransition = {
        duration: 1,
        ease: [0.43, 0.13, 0.23, 0.96],
    };

    interface PageWrapperProps {
        children: React.ReactNode;
    }
    const handleLogout = async () => {
        const response = await apiStore.logout();
        
        if (response === 200) {
            setTimeout(() => {
                toast.success(`${userName}, you logout successfully`);
                navigate("/");
            }, 1);
            dispatch(logout());
            onClose();
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="fixed inset-0  backdrop-blur-sm  flex items-center justify-center h-full w-full"
        >
            <div
                onClick={onClose}
                className="cursor-pointer relative top-[-75px] right-[-250px] h-fit w-fit rounded-[50%] bg-white dark:bg-black"
            >
                <X className="text-black dark:text-white" size={22} />
            </div>
            <div
                ref={modalRef}
                className="bg-slate-200  flex flex-col  justify-around items-center dark:bg-slate-600 p-4 rounded-md shadow-xl h-[10rem] w-[15rem]"
            >
                <p className="text-black dark:text-white text-sm italic mt-2 place-self-center">
                    See ya next time {userName}
                </p>

                <div className="w-full flex justify-center items-center">
                    <Button
                        onClick={handleLogout}
                        className=" transform duration-150 bg-red-300 hover:bg-red-500  dark:bg-red-600 dark:hover:bg-red-800"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default LogoutPopup;
