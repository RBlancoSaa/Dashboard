import React from "react";

export function Button({ children, ...props }) {
  return (
    <button className="px-4 py-2 rounded bg-[#523F31] text-white hover:bg-[#2D1E17]" {...props}>
      {children}
    </button>
  );
}
