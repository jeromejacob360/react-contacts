import React, { useEffect, useRef } from "react";

export default function ClickAway({ children, setOption }) {
  const ref = useRef();

  function handleClick(e) {
    if (ref.current && !ref.current.contains(e.target)) setOption(false);
  }

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return <div ref={ref}>{children}</div>;
}
