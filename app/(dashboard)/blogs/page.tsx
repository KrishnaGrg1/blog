import DeleteDialog from "@/components/DeleteModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Edit, Plus, Eye, FileText, Calendar } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function BlogsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  const blogs = await prisma.blog.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate stats
  const publishedCount = blogs.filter((b) => b.published).length;
  const draftCount = blogs.length - publishedCount;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold ">My Blogs</h1>
            <p className="text-slate-600 mt-2">
              Manage and organize your blog posts
            </p>
          </div>
          <Link href="/blogs/new">
            <Button size="lg" className="gap-2 shadow-lg shadow-slate-900/10">
              <Plus className="h-5 w-5" />
              Create Blog
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium ">Total Posts</p>
                  <p className="text-3xl font-bold  mt-2">{blogs.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full  flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Published</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {publishedCount}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Drafts</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">
                    {draftCount}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">All Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold ">Title</TableHead>
                    <TableHead className="font-semibold ">Slug</TableHead>
                    <TableHead className="font-semibold ">Status</TableHead>
                    <TableHead className="font-semibold ">Created</TableHead>
                    <TableHead className="font-semibold ">Updated</TableHead>
                    <TableHead className="font-semibold  text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <FileText className="h-10 w-10 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-semibold  mb-2">
                            No blogs yet
                          </h3>
                          <p className="text-slate-600 text-center max-w-sm mb-6">
                            Get started by creating your first blog post and
                            share your ideas with the world.
                          </p>
                          <Link href="/blogs/new">
                            <Button className="gap-2">
                              <Plus className="h-4 w-4" />
                              Create Your First Blog
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {blog.photo ? (
                              <img
                                src={blog.photo}
                                alt={blog.title}
                                className="h-10 w-10 rounded-md object-cover "
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center ">
                                <FileText className="h-5 w-5 text-slate-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold  truncate">
                                {blog.title}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            /{blog.slug}
                          </code>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {blog.updatedAt.getTime() !==
                          blog.createdAt.getTime() ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              {new Date(blog.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {blog.published && (
                              <Link href={`/blog/${blog.slug}`} target="_blank">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1.5 h-8"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </Button>
                              </Link>
                            )}
                            <Link href={`/blogs/${blog.id}/edit`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 h-8"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                            </Link>
                            <DeleteDialog
                              title="Delete Blog Post"
                              description="Are you sure you want to delete this blog? This action cannot be undone and all associated data will be permanently removed."
                              id={blog.id}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
