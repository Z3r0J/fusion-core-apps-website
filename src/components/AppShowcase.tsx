import { motion } from "framer-motion";

const phones = [
  {
    src: "/images/screenshots/cartwise-list.jpg",
    alt: "CartWise grocery list app showing organized shopping items",
    position: "absolute left-0 top-8 z-10",
    rotate: -6,
    scale: 0.88,
    opacity: 0.8,
    delay: 0.2,
    floatDuration: 6,
    floatY: [-0, -5, 0],
  },
  {
    src: "/images/screenshots/bible-tpt-reading.jpg",
    alt: "Bible TPT app showing clean reading interface with dark theme",
    position: "absolute left-1/2 -translate-x-1/2 top-0 z-20",
    rotate: 0,
    scale: 1,
    opacity: 1,
    delay: 0.4,
    floatDuration: 5,
    floatY: [0, -8, 0],
  },
  {
    src: "/images/screenshots/bible-tpt-verse.jpg",
    alt: "Bible TPT verse of the day with colorful card design",
    position: "absolute right-0 top-8 z-10",
    rotate: 6,
    scale: 0.88,
    opacity: 0.8,
    delay: 0.6,
    floatDuration: 7,
    floatY: [0, -5, 0],
  },
] as const;

function PhoneFrame({
  src,
  alt,
  rotate,
  scale,
  opacity,
  position,
  delay,
  floatDuration,
  floatY,
}: (typeof phones)[number]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={position}
      style={{ rotate: `${rotate}deg`, scale }}
    >
      <motion.div
        animate={{ y: floatY as unknown as number[] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-[220px] h-[440px] rounded-[2.5rem] bg-gray-950 border-[3px] border-gray-700 overflow-hidden shadow-2xl"
      >
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-950 rounded-full z-10" />
        {/* Screen */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.3rem]">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AppShowcase() {
  return (
    <div className="relative w-[420px] h-[500px] mx-auto">
      {/* Glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />
      {phones.map((phone) => (
        <PhoneFrame key={phone.src} {...phone} />
      ))}
    </div>
  );
}
