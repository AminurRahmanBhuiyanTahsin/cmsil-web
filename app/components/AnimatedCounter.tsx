"use client";
import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

export default function AnimatedCounter({ from, to }: { from: number; to: number }) {
  // 1. Create a state to hold the actual number
  const [displayValue, setDisplayValue] = useState(from);
  const count = useMotionValue(from);

  useEffect(() => {
    // 2. Use 'onUpdate' to update the React state while animating
    const controls = animate(count, to, { 
      duration: 1.5, 
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)) 
    });
    
    return () => controls.stop();
  }, [count, to]);

  // 3. Now we are returning a simple number, which React loves!
  return <>{displayValue}</>;
}