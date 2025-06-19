import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder,PenSquare,FolderPlus, MapPin} from 'lucide-react';
import AppLogo from './app-logo';
import {usePage} from '@inertiajs/react';


const footerNavItems: NavItem[] = [
   
];

export function AppSidebar() {
    const {auth} = usePage().props;
    const user = auth.user as{id:number; name:string; role:'admin'|'user'}|null;
   
    const mainNavItems: NavItem[] = user?.role==='admin'? [
    {
        title: 'Posts',
        href: '/admin/posts',
        icon: PenSquare,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderPlus,
    },
    {
        title: 'Provinces',
        href: '/admin/provinces',
        icon: MapPin,
    },
] : user?.role==='user'? [ 
     {
        title: 'Blogs',
        href: '/user/posts',
        icon: BookOpen,
    },
    {
        title: 'Hotels',
        href: '/user/posts?category=Hotel',
        icon: FolderPlus,
    },
    {
        title: 'AboutMe',
        href: '/user/aboutme',
        icon: Folder,
    },
] : [];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
