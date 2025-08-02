import React from "react";

import "./Topbar.css";

export default function Topbar({ collapsed }) {
  const dynamicPadding = collapsed ? "0px 20px 0px 50px" : "0px 20px 0px 210px";

  return (
    <div className="topbar" style={{ padding: dynamicPadding }}>
      <h2 className="logo">Admin Panel</h2>
    </div>
  );
}
