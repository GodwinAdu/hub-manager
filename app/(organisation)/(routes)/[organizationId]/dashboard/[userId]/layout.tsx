import Navbar from "@/components/commons/Navbar";
import AppSidebarMain from "@/components/sidebar/app-sidebar-main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@/lib/helpers/session";




export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await currentUser();
  
    const pro = false; // TODO: fetch organization and check subscription plan


    return (
        
               
                    <SidebarProvider className="sidebar">
                        <AppSidebarMain />
                        <SidebarInset >
                            <Navbar  user={user} pro={pro} />
                            <div className="relative scrollbar-hide">
                                <div id="main-content" className="py-4 px-4 overflow-hidden scrollbar-hide">
                                    {children}
                                </div>
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
            
    );
}