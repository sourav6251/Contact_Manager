import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 30 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -30 },
};

const pageTransition = {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
};

interface PageWrapperProps {
    children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => (
    <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        style={{ minHeight: '100vh' }} 
    >
        {children}
    </motion.div>
);
