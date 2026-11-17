"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
  delay = 100,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      if (position === "top") {
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
      } else if (position === "bottom") {
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
      } else if (position === "left") {
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
      } else if (position === "right") {
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
      }

      setCoords({ top, left });
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  if (!content) return <>{children}</>;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-flex items-center ${className}`}
      >
        {children}
      </div>

      {mounted &&
        isVisible &&
        coords &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform:
                position === "top"
                  ? "translate(-50%, -100%)"
                  : position === "bottom"
                  ? "translate(-50%, 0)"
                  : position === "left"
                  ? "translate(-100%, -50%)"
                  : "translate(0, -50%)",
            }}
            className="z-[9999] pointer-events-none px-2.5 py-1.5 text-[11px] font-medium text-white bg-slate-900/95 rounded-lg shadow-xl backdrop-blur-xs border border-slate-700/60 max-w-xs animate-in fade-in zoom-in-95 duration-150 leading-relaxed text-center"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

export function InfoTooltip({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <Tooltip content={text} position="top">
      <span
        tabIndex={0}
        className={`inline-flex items-center justify-center text-slate-400 hover:text-slate-600 focus:text-blue-600 cursor-help transition-colors ${className}`}
        aria-label={text}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </span>
    </Tooltip>
  );
}

