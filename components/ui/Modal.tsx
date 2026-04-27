import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, title, children }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full max-w-md p-6 bg-white border border-emerald-100 rounded-2xl shadow-2xl dark:bg-neutral-900 dark:border-neutral-800"
                    >
                        <h2 className="mb-4 text-xl font-semibold text-emerald-900 dark:text-emerald-400">
                            {title}
                        </h2>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}