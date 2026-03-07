import { useEffect, useRef } from "react";

function GateTransition({ active, duration = 1200, onComplete }) {
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      hasCompletedRef.current = false;
      return;
    }

    hasCompletedRef.current = false;

    const timeoutId = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        if (onComplete) {
          onComplete();
        }
      }
    }, duration);

    return () => {
      hasCompletedRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [active, duration, onComplete]);

  if (!active) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(90deg,rgba(6,10,24,0.97),rgba(8,12,28,0.97))",
          animation: "gateL 1.2s cubic-bezier(0.7,0,1,1) forwards",
          borderRight: "2px solid rgba(240,192,64,0.4)",
          boxShadow: "inset -30px 0 60px rgba(240,160,20,0.1)",
        }}
      />
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(270deg,rgba(6,10,24,0.97),rgba(8,12,28,0.97))",
          animation: "gateR 1.2s cubic-bezier(0.7,0,1,1) forwards",
          borderLeft: "2px solid rgba(240,192,64,0.4)",
          boxShadow: "inset 30px 0 60px rgba(240,160,20,0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(240,192,64,0.15) 0%, transparent 60%)",
          animation: "fadeIn 0.6s ease 0.3s both",
        }}
      />
    </div>
  );
}

export default GateTransition;

