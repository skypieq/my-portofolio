import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Smooth spring physics for the outer ring
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16); // Center the 32px ring
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Outer Thick Ring */}
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          borderWidth: isHovering ? "1px" : "2px",
          borderColor: isHovering ? "rgba(0, 242, 255, 0.8)" : "rgba(0, 242, 255, 0.3)",
        }}
        className="w-8 h-8 rounded-full border-neon-cyan fixed top-0 left-0 transition-colors duration-300"
      />

      {/* Inner Solid Dot */}
      <motion.div
        animate={{
          x: mousePos.x - 3,
          y: mousePos.y - 3,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 500, mass: 0.5 }}
        className="w-1.5 h-1.5 bg-neon-cyan rounded-full fixed top-0 left-0 neon-border"
      />

      {/* Aesthetic Glow Effect */}
      <motion.div
        animate={{
          x: mousePos.x - 40,
          y: mousePos.y - 40,
          opacity: isHovering ? 0.3 : 0.1,
        }}
        className="w-20 h-20 bg-neon-cyan/20 blur-2xl rounded-full fixed top-0 left-0"
      />
    </div>
  );
}
