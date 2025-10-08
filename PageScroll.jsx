"use client";

import { useState, useEffect, useRef } from "react";

export default function PageScroll({ children }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("down");
  const isScrolling = useRef(false); // Flag برای جلوگیری از چند Scroll پشت سر هم

  const scrollHandler = (e) => {
    e.preventDefault();
    if (isScrolling.current) return; // اگر در حال Scroll هستیم، کاری نکن

    const delta = e.deltaY;
    let nextIndex = current;

    if (delta > 0 && current < children.length - 1) {
      setDirection("down");
      nextIndex = current + 1;
    } else if (delta < 0 && current > 0) {
      setDirection("up");
      nextIndex = current - 1;
    } else {
      return; // اگر به انتها یا ابتدا رسیدیم، چیزی تغییر نکند
    }

    isScrolling.current = true; // Lock کردن Scroll

    setCurrent(nextIndex);

    // باز کردن Scroll بعد از مدت زمان انیمیشن
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000); // برابر duration انیمیشن
  };

  useEffect(() => {
    window.addEventListener("wheel", scrollHandler, { passive: false });
    return () => window.removeEventListener("wheel", scrollHandler);
  }, [current]);

  const goTo = (index) => {
    if (isScrolling.current || index === current) return;

    setDirection(index > current ? "down" : "up");
    setCurrent(index);

    isScrolling.current = true;
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Sections */}
      {children.map((child, i) => {
        const style = {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transition: "transform 1.1s ease, opacity 1.1s ease",
          transform:
            i === current
              ? "translateY(0)"
              : i < current
              ? "translateY(-100%)"
              : "translateY(100%)",
          opacity: i === current ? 1 : 0.4,
        };
        return (
          <div key={i} style={style}>
            {child}
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50 border-gray-200 shadow shadow-gray-100 border p-2 rounded-sm bg-white">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? "bg-gray-700 scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
