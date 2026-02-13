import prisma from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";
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
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Stories worth
              </span>
              <br />
              <span>reading.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
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
              <div className="h-px flex-1 bg-gradient-to-r from-foreground to-transparent" />
              <span className="text-xs font-semibold tracking-widest uppercase">
                Featured Story
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-foreground to-transparent" />
            </div>

            <Link href={`/blog/${featuredBlog.slug}`} className="group">
              <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Featured Image */}
                {featuredBlog.photo && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                    <img
                      src={featuredBlog.photo}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                {/* Featured Content */}
                <div className="space-y-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  <h2 className="text-4xl sm:text-5xl font-bold tracking-tight group-hover:text-muted-foreground transition-colors">
                    {featuredBlog.title}
                  </h2>

                  {/* Description */}
                  {featuredBlog.description && (
                    <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
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
                            className="rounded-full"
                          >
                            {keyword.trim()}
                          </Badge>
                        ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center gap-2 font-medium group-hover:gap-4 transition-all">
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
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Latest Articles
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Image */}
                    {blog.photo && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                        <img
                          src={blog.photo}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}

                    <CardContent className="p-6 space-y-4">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <time>{formatDate(blog.createdAt)}</time>
                        <span>•</span>
                        <span>{calculateReadTime(blog.content)} min read</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold line-clamp-2 group-hover:text-muted-foreground transition-colors leading-tight">
                        {blog.title}
                      </h3>

                      {/* Description */}
                      {blog.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {blog.description}
                        </p>
                      )}

                      {/* Author */}
                      {blog.user && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          {blog.user.image && (
                            <img
                              src={blog.user.image}
                              alt={blog.user.name || "Author"}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm font-medium">
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
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">No stories yet</h3>
              <p className="text-muted-foreground">
                Check back soon for new content from our writers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
