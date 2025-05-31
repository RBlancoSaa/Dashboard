import React from "react";

export function Card({ children, ...props }) {
  return <div className="border rounded-xl p-4 bg-white" {...props}>{children}</div>;
}

export function CardContent({ children, ...props }) {
  return <div className="mt-2" {...props}>{children}</div>;
}

