"use client";

import { useState, useEffect, useRef } from "react";

export default function PageScroll({ children, opacity }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("down");
  const isScrolling = useRef(false); // Flag برای جلوگیری از چند Scroll پشت سر هم

  const touchStart = useRef(0);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const delta = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 30) return; // جلوگیری از جابجایی خیلی کوچک
    if (delta > 0 && current < children.length - 1) {
      goTo(current + 1); // اسکرول پایین
    } else if (delta < 0 && current > 0) {
      goTo(current - 1); // اسکرول بالا
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", scrollHandler, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", scrollHandler);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [current]);

  useEffect(() => {
    const handleTouchMove = (e) => {
      // اگر بخش فعلی 0 (اولین) هست، اجازه بده pull-to-refresh کار کنه
      if (current === 0 && e.touches[0].clientY > touchStart.current) {
        return; // هیچ کاری انجام نمی‌ده → مرورگر می‌تونه refresh کنه
      }
      e.preventDefault(); // در بقیه موارد scroll سفارشی رو فعال کن
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [current]);

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
      {children &&
        children?.map((child, i) => {
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
            opacity: i === current ? 1 : opacity,
          };
          return (
            <div key={i} style={style}>
              {child}
            </div>
          );
        })}

      {/* Dots */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50 border-gray-200 shadow shadow-gray-100 border p-2 rounded-sm bg-white">
        {children &&
          children?.map((_, i) => (
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
