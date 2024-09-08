
import { SidebarProvider } from "../../contexts/sidebar.context";
import { Menu } from "../../shared/components/menu/menu";
import { Sidebar } from "../../shared/components/sidebars/sidebar";
import { CreateTravelDiary } from "../travel-diary/create-travel-diary/create-travel-diary";

export const Home = () => {
  return <SidebarProvider>
    <Menu />
    <Sidebar />
    <CreateTravelDiary />
  </SidebarProvider>
}