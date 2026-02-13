import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Plus,
  LogOut,
  User,
  Settings,
  Home,
  Menu,
} from "lucide-react";
import { ModeToggle } from "@/components/toggle-mode";
import { signOut } from "better-auth/api";
import { toast } from "sonner";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-secondary ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-8">
              <Link href="/blogs" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-lg  flex items-center justify-center group-hover:scale-105 ">
                  <FileText className="h-5 w-5 " />
                </div>
                <span className="text-xl font-bold hidden sm:block">
                  BlogHub
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                <Link href="/blogs">
                  <Button variant="ghost" className="gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/blogs/new">
                  <Button variant="ghost" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Blog
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - User Menu */}
            <div className="flex items-center gap-4">
              {/* Create Blog Button (Mobile) */}
              <ModeToggle />
              <Link href="/blogs/new" className="md:hidden">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full "
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className=" font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Mobile Menu Items */}
                  <div className="md:hidden">
                    <Link href="/blogs">
                      <DropdownMenuItem>
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/blogs/new">
                      <DropdownMenuItem>
                        <Plus className="mr-2 h-4 w-4" />
                        New Blog
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                  </div>

                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <ModeToggle /> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
