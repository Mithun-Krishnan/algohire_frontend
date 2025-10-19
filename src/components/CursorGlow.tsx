import { useEffect, useState, useRef } from "react";

const CursorGlow = () => {
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [layer1, setLayer1] = useState({ x: 0, y: 0 });
  const [layer2, setLayer2] = useState({ x: 0, y: 0 });
  const [layer3, setLayer3] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setLayer1((prev) => ({
        x: lerp(prev.x, targetPosition.x, 0.08),
        y: lerp(prev.y, targetPosition.y, 0.08),
      }));
      setLayer2((prev) => ({
        x: lerp(prev.x, targetPosition.x, 0.05),
        y: lerp(prev.y, targetPosition.y, 0.05),
      }));
      setLayer3((prev) => ({
        x: lerp(prev.x, targetPosition.x, 0.03),
        y: lerp(prev.y, targetPosition.y, 0.03),
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetPosition]);

  return (
    <>

    
      {/* Layer 3 - Slowest, outermost glow */}
      <div
        className="pointer-events-none fixed z-50 transition-opacity duration-700"
        style={{
          left: `${layer3.x}px`,
          top: `${layer3.y}px`,
          opacity: isVisible ? 0.6 : 0,
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="absolute h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[120px] dark:bg-primary-glow/12" />
        </div>
      </div>

      {/* Layer 2 - Medium speed */}
      <div
        className="pointer-events-none fixed z-50 transition-opacity duration-600"
        style={{
          left: `${layer2.x}px`,
          top: `${layer2.y}px`,
          opacity: isVisible ? 0.8 : 0,
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] dark:bg-primary-glow/18" />
          <div className="absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[80px] dark:bg-primary-glow/25" />
        </div>
      </div>

      {/* Layer 1 - Fastest, innermost glow */}
      <div
        className="pointer-events-none fixed z-50 transition-opacity duration-500"
        style={{
          left: `${layer1.x}px`,
          top: `${layer1.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/18 blur-[70px] dark:bg-primary-glow/30" />
          <div className="absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/22 blur-[50px] dark:bg-primary-glow/40" />
        </div>
      </div>
    </>
  );
};

export default CursorGlow;




// import { useEffect, useState } from "react";

// const CursorGlow = () => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setPosition({ x: e.clientX, y: e.clientY });
//       if (!isVisible) setIsVisible(true);
//     };

//     const handleMouseLeave = () => {
//       setIsVisible(false);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     document.body.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       document.body.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, [isVisible]);

//   return (
//     <>
//       {/* Main cursor glow */}
//       <div
//         className="pointer-events-none fixed z-50 transition-opacity duration-500"
//         style={{
//           left: `${position.x}px`,
//           top: `${position.y}px`,
//           opacity: isVisible ? 1 : 0,
//         }}
//       >
//         <div className="relative -translate-x-1/2 -translate-y-1/2">
//           {/* Outer glow - much bigger */}
//           <div className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px] dark:bg-primary-glow/15" />
//           {/* Middle glow */}
//           <div className="absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[80px] dark:bg-primary-glow/25" />
//           {/* Inner glow */}
//           <div className="absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[60px] dark:bg-primary-glow/35" />
//         </div>
//       </div>
//     </>
//   );
// };

// export default CursorGlow;
