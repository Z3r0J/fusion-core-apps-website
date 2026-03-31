import { motion } from "framer-motion";

export function PhoneMockup() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto w-[260px] h-[520px] rounded-[2.5rem] border-4 border-gray-800 dark:border-gray-600 bg-gray-900 shadow-2xl overflow-hidden"
    >
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-20 h-5 rounded-full bg-gray-900" />

      {/* Screen content */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff8a2a] via-[#e8455b] to-[#2ecfff] opacity-80" />

      {/* App UI mockup overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        {/* Fake app icon */}
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3"
            />
          </svg>
        </div>
        <div className="w-24 h-3 rounded-full bg-white/30 mb-2" />
        <div className="w-32 h-2 rounded-full bg-white/20 mb-6" />

        {/* Fake card elements */}
        <div className="w-full space-y-3">
          <div className="h-12 rounded-xl bg-white/15 backdrop-blur-sm" />
          <div className="h-12 rounded-xl bg-white/10 backdrop-blur-sm" />
          <div className="h-12 rounded-xl bg-white/10 backdrop-blur-sm" />
        </div>
      </div>

      {/* Shine/reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}
