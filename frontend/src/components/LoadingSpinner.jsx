import { motion } from 'framer-motion';

export default function LoadingSpinner({ label = 'Birimo gufunguka...' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-4 border-emerald-600 border-t-transparent"
      />
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
}
