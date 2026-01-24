import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <SidebarProvider className="h-full w-full overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex h-full flex-col overflow-hidden md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:rounded-xl">
        <main className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
