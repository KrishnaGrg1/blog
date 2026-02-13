import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  User as UserIcon,
} from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  // Get user stats
  const [totalBlogs, publishedBlogs, draftBlogs] = await Promise.all([
    prisma.blog.count({ where: { userId: user.id } }),
    prisma.blog.count({ where: { userId: user.id, published: true } }),
    prisma.blog.count({ where: { userId: user.id, published: false } }),
  ]);

  // Get recent blogs
  const recentBlogs = await prisma.blog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight ">Profile</h1>
          <p className="text-slate-600 mt-2">
            View and manage your account information
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-32 w-32 ring-4 ring-slate-100">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback className=" text-3xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {user.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Mail className="h-4 w-4" />
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>

                  {user.emailVerified && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}

                  <Separator />

                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-slate-500">Joined</p>
                        <p className="font-medium text-slate-900">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-slate-500">Last Updated</p>
                        <p className="font-medium text-slate-900">
                          {new Date(user.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900">
                      {totalBlogs}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Total Blogs</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {publishedBlogs}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Published</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">
                      {draftBlogs}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Drafts</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentBlogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-sm">No recent activity</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="p-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {blog.title}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <Badge
                            variant={blog.published ? "default" : "secondary"}
                            className={
                              blog.published
                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                            }
                          >
                            {blog.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg font-semibold">
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      User ID
                    </label>
                    <p className="text-sm text-slate-600 mt-1 font-mono bg-slate-100 px-3 py-2 rounded">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <p className="text-sm text-slate-900 mt-1">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <p className="text-sm text-slate-900 mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Email Status
                    </label>
                    <p className="text-sm text-slate-900 mt-1">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-600">Not Verified</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
