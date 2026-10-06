import SiteNavbar from "@/components/common/SiteNavbar";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <SiteNavbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
