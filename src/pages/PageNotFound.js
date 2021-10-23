import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <Link to="/" className="w-screen h-screen">
      <img className="mx-auto" src="404.jpg" alt="" />
    </Link>
  );
}
