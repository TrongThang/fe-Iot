"use client"
import {
    Users,
    ShoppingCart,
    Package,
    HelpCircle,
    ChevronDown,
    LayoutDashboard,
    UserCog,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider

} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

function SidebarUser() {
    return (
        <SidebarProvider>
            <Sidebar className="bg-[#1F2937] text-white">
                <SidebarHeader className="py-3 pe-9 pb-5">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <div>
                                    <div className="flex flex-col gap-0.5 leading-none ml-2">
                                        <span className="font-semibold">SmartNet Solutions </span>
                                        <span className="text-xs opacity-70">Admin Portal</span>
                                    </div>
                                </div>

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    {/* Tổng Quan */}
                    <SidebarGroup>
                        <Collapsible defaultOpen className="group/collapsible w-full">
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="flex w-full items-center justify-between">
                                    Tổng Quan
                                    <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <a href="/admin/dashboard">
                                                    <LayoutDashboard className="size-4" />
                                                    <span>Dashboard</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <a href="/components">
                                                    <Package className="size-4" />
                                                    <span>Components</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </SidebarGroup>

                    {/* Quản Lý */}
                    <SidebarGroup>
                        <Collapsible defaultOpen className="group/collapsible w-full">
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="flex w-full items-center justify-between">
                                    Quản Lý
                                    <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <a href="/devices">
                                                    <UserCog className="size-4" />
                                                    <span>Thiết bị</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <a href="/groups">
                                                    <Users className="size-4" />
                                                    <span>Nhóm</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <a href="/spaces">
                                                    <Package className="size-4" />
                                                    <span>Không gian</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <a href="/profile">
                                                    <ShoppingCart className="size-4" />
                                                    <span>Tài khoản</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/help">
                                    <HelpCircle className="size-4" />
                                    <span>Trợ Giúp</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    )
}

export default SidebarUser;