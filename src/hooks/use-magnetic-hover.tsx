import { useEffect, RefObject } from "react";

export const useMagneticHover = (ref: RefObject<HTMLElement>, strength: number = 0.3) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = "translate(0, 0) scale(1)";
    };

    element.addEventListener("mouseenter", () => {
      element.addEventListener("mousemove", handleMouseMove);
    });
    
    element.addEventListener("mouseleave", () => {
      element.removeEventListener("mousemove", handleMouseMove);
      handleMouseLeave();
    });

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, strength]);
};
