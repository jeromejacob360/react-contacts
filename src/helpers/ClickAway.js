import React, { useEffect, useRef } from "react";

export default function ClickAway({ children, setOption }) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOption(false);
      }
    }

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [setOption]);

  return <div ref={ref}>{children}</div>;
}
