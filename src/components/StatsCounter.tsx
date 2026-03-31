import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  prefix?: string;
}

interface Props {
  stats: StatItem[];
}

function Counter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 2,
        ease: [0.21, 0.47, 0.32, 0.98],
      });
      return controls.stop;
    }
  }, [isInView, motionValue, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatsCounter({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-gray-200 md:dark:divide-gray-700">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center gap-2 px-6">
          <span className="text-4xl font-bold text-[#2ECFFF]">
            <Counter
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
            />
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
