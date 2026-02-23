import * as React from "react";
import { MessageSquare, Palette, PieChart } from "lucide-react";

import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "./ui/sidebar";
import { useAuth } from "@now/utils";
import { ModeToggle } from "./mode-toggle";

const data = {
    projects: [
        {
            name: "Sketch Now",
            url: "/#/sketch-now",
            icon: Palette
        },
        {
            name: "Visualize Now",
            url: "/#/visualize-now",
            icon: PieChart
        },
        {
            name: "Chat Now",
            url: "/#/chat-now",
            icon: MessageSquare
        }
    ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth();
    if (!user) {
        return null;
    }
    return (
        <Sidebar className="z-20" {...props}>
            <SidebarContent>
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle />
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
