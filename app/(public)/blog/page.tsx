import prisma from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function PublicPage() {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Separate featured (first) blog from the rest
  const [featuredBlog, ...otherBlogs] = blogs;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Header */}
      <header className="border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span>Stories worth</span>
              <br />
              <span className="text-slate-900">reading.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Insights, ideas, and inspiration from our community of writers.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Featured Article */}
        {featuredBlog && (
          <section className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-900">
                Featured Story
              </span>
            </div>

            <Link href={`/blog/${featuredBlog.slug}`} className="group">
              <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Featured Image */}
                {featuredBlog.photo && (
                  <div className="relative  overflow-hidden rounded-2xl ">
                    <img
                      src={featuredBlog.photo}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Featured Content */}
                <div className="space-y-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredBlog.createdAt)}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {calculateReadTime(featuredBlog.content)} min
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                    {featuredBlog.title}
                  </h2>

                  {/* Description */}
                  {featuredBlog.description && (
                    <p className="text-lg text-slate-600 leading-relaxed line-clamp-3">
                      {featuredBlog.description}
                    </p>
                  )}

                  {/* Keywords */}
                  {featuredBlog.seoKeywords && (
                    <div className="flex flex-wrap gap-2">
                      {featuredBlog.seoKeywords
                        .split(",")
                        .slice(0, 3)
                        .map((keyword, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100"
                          >
                            {keyword.trim()}
                          </Badge>
                        ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-slate-900 font-medium group-hover:gap-4 transition-all">
                    Read full story
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* All Articles Grid */}
        {otherBlogs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">
              Latest Articles
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group"
                >
                  <Card className="h-full border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl overflow-hidden">
                    {/* Image */}
                    {blog.photo && (
                      <div className="relative  overflow-hidden bg-slate-200">
                        <img
                          src={blog.photo}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}

                    <CardContent className="p-6 space-y-4">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <time>{formatDate(blog.createdAt)}</time>
                        <span>•</span>
                        <span>{calculateReadTime(blog.content)} min read</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-slate-700 transition-colors leading-tight">
                        {blog.title}
                      </h3>

                      {/* Description */}
                      {blog.description && (
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {blog.description}
                        </p>
                      )}

                      {/* Author */}
                      {blog.user && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          {blog.user.image && (
                            <img
                              src={blog.user.image}
                              alt={blog.user.name || "Author"}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm font-medium text-slate-700">
                            {blog.user.name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                No stories yet
              </h3>
              <p className="text-slate-600">
                Check back soon for new content from our writers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
