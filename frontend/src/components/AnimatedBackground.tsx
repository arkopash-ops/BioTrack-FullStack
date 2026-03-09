import { useEffect, useState } from "react";
import { animate } from "animejs";

import type { Circle } from "../interfaces";

const AnimatedBackground = () => {
  const [circles] = useState<Circle[]>(() =>
    Array.from({ length: 20 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 60 + Math.random() * 60,
    })),
  );

  useEffect(() => {
    animate(".circle", {
      translateY: [-20, 20],
      translateX: [-10, 10],
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      duration: 3000,
      delay: (_, i) => i * 200,
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg,#0f2027,#2ecc71,#27ae60)",
        overflow: "hidden",
        zIndex: -1,
      }}
    >
      {circles.map((circle, i) => (
        <div
          key={i}
          className="circle"
          style={{
            position: "absolute",
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            top: `${circle.top}%`,
            left: `${circle.left}%`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
