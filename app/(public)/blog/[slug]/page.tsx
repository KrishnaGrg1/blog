import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: {
      slug: String(slug),
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!blog) {
    notFound();
  }

  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Estimate reading time (average 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Parse SEO keywords
  const keywords = blog.seoKeywords
    ? blog.seoKeywords.split(",").map((k) => k.trim())
    : [];

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 space-y-8">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.createdAt.toISOString()}>
                {formattedDate}
              </time>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            {blog.user?.name && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  {blog.user.image && (
                    <img
                      src={blog.user.image}
                      alt={blog.user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span>By {blog.user.name}</span>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
            {blog.title}
          </h1>

          {/* Description */}
          {blog.description && (
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {blog.description}
            </p>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="rounded-full">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {blog.photo && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12 group">
            <img
              src={blog.photo}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Blog Content */}
        <div className="pb-20">
          <div
            className="prose prose-lg max-w-none
              dark:prose-invert
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
              prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8
              prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
              prose-p:leading-relaxed
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:font-semibold
              prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-secondary prose-pre:shadow-lg
              prose-img:rounded-lg prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:italic
              prose-ul:list-disc prose-ol:list-decimal
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Footer */}
        <div className="border-t py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Published on {formattedDate}
            </div>
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                All Blogs
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
