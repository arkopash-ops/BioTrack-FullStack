import { useState } from "react";

import type { Circle } from "../interfaces";

const Background = () => {
  const [circles] = useState<Circle[]>(() =>
    Array.from({ length: 20 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 60 + Math.random() * 60,
    })),
  );

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg,#06130c,#0b2417,#1a4a31)",
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
            background: "rgba(109,220,139,0.08)",
            top: `${circle.top}%`,
            left: `${circle.left}%`,
          }}
        />
      ))}
    </div>
  );
};

export default Background;
