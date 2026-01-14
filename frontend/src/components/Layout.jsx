import { Outlet, useLocation } from "react-router-dom";
import NavButtons from "./NavButtons";

export default function Layout() {
  const location = useLocation();
  const esHome = location.pathname === "/";

  return (
    <div>
      {!esHome && <NavButtons />}
      <Outlet />
    </div>
  );
}
