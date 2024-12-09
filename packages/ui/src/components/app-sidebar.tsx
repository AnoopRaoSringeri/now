import * as React from "react";
import { MessageSquare, Palette, PieChart, SquareTerminal } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "./ui/sidebar";

const data = {
    user: {
        name: "now",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg"
    },
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "History",
                    url: "#"
                },
                {
                    title: "Starred",
                    url: "#"
                },
                {
                    title: "Settings",
                    url: "#"
                }
            ]
        }
    ],
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
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
