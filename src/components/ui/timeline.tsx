"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  solutionTitle: string;
  solutionDescription?: string;
  tags?: string[];
  accentColor?: string;
  problem: {
    statement: string;
    explanation?: string;
  };
}

export const Timeline = ({
  data,
  title = "HOW IT WORKS",
  subtitle = "Discover how Antbox bridges the gap between campus learning and day-one corporate readiness."
}: {
  data: TimelineEntry[];
  title?: string;
  subtitle?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const updateHeight = () => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          setHeight(rect.height);
        }
      };
      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 80%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div
      className="w-full bg-[var(--cream)] font-sans relative"
      ref={containerRef}
      style={{ background: "var(--cream)" }}
    >
      {/* Clean Centered Header with generous spacing and zero borders/faded bars */}
      <div className="max-w-4xl mx-auto pt-24 pb-12 text-center flex flex-col items-center px-4">
        <h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[var(--black)] uppercase"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          HOW <span style={{ color: "var(--accent-purple)" }}>IT WORKS</span>
        </h2>
        <p
          className="text-neutral-700 text-base sm:text-lg md:text-xl max-w-2xl font-medium mt-3 leading-relaxed"
          style={{ fontFamily: "Century Gothic, sans-serif" }}
        >
          {subtitle}
        </p>
      </div>

      {/* Main Timeline Body: Spacious vertical padding so steps never crowd each other */}
      <div ref={ref} className="relative max-w-[1360px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-8 pb-48">
        {data.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start min-h-[50vh] md:min-h-[60vh] pt-20 md:pt-36 pb-12"
          >
            {/* LEFT: Sticky Solution Headline with Glowing Purple Dot */}
            <div className="sticky top-40 md:top-48 z-20 flex items-center gap-4 md:gap-7">
              {/* Purple Dot positioned directly on the vertical line */}
              <div className="relative flex items-center justify-center shrink-0 w-8 h-8">
                <div className="w-4 h-4 rounded-full bg-[var(--accent-purple)] shadow-[0_0_14px_rgba(187,98,222,0.95)] border-2 border-[var(--cream)]" />
              </div>

              {/* Solution Headline Only */}
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--black)] tracking-tight leading-tight max-w-lg"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {item.solutionTitle}
              </h3>
            </div>

            {/* RIGHT: Problem Card (THE GAP) Beside It */}
            <div className="w-full pl-12 lg:pl-0">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[var(--accent-purple)]/40 bg-[#240a2f] flex flex-col justify-between transition-all hover:shadow-2xl hover:border-[var(--accent-purple)]/70 duration-300">
                <div className="p-6 md:p-8">
                  <p
                    className="text-white font-bold text-lg md:text-xl leading-snug"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {item.problem.statement}
                  </p>
                  {item.problem.explanation && (
                    <p
                      className="text-neutral-300 text-sm md:text-base mt-4 leading-relaxed font-normal"
                      style={{ fontFamily: "Century Gothic, sans-serif" }}
                    >
                      {item.problem.explanation}
                    </p>
                  )}
                </div>
                <div className="bg-[#180620] px-6 md:px-8 py-3.5 border-t-2 border-[var(--accent-purple)] flex items-center">
                  <span className="inline-block bg-[var(--accent-purple)] text-white px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm">
                    THE GAP
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Vertical Transit Line positioned exactly through the dots */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-[31px] sm:left-[47px] md:left-[63px] lg:left-[79px] top-0 overflow-hidden w-[2px] bg-neutral-300/70"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[var(--accent-purple)] via-purple-400 to-transparent from-[0%] via-[20%] rounded-full shadow-[0_0_14px_rgba(187,98,222,1)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
