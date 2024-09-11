
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../../contexts/sidebar.context";
import { Menu } from "../../shared/components/menu/menu";
import { Sidebar } from "../../shared/components/sidebars/sidebar";

export const Home = () => {
  return <SidebarProvider>
    <Menu />
    <Sidebar />

    <div className="ml-home">
      <Outlet />
    </div>
  </SidebarProvider>
}