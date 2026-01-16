import { Outlet, useLocation } from "react-router-dom";
import NavButtons from "./NavButtons";


export default function Layout() {
  return (
    <div style={{ padding: 20 }}>
      
      {/* BOTONES GLOBALES */}
      <NavButtons />

      {/* 👇 ESTO ES OBLIGATORIO */}
      <Outlet />

    </div>
  );
}