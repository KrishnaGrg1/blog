import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import "./blog-content.css";

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug: String(slug) },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
  });

  if (!blog) notFound();

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const keywords = blog.seoKeywords
    ? blog.seoKeywords.split(",").map((k) => k.trim())
    : [];

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
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

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Meta + Title */}
        <div className="py-12 space-y-8">
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
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}
                  <span>By {blog.user.name}</span>
                </div>
              </>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {blog.description}
            </p>
          )}

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

        {/* ── Cover Image ───────────────────────────────────────────────
            FIX: The wrapper is a flex container that centers the image.
            The <img> itself:
              - NO w-full  (was forcing 100% width, making portrait huge)
              - max-w-full  (never overflow the column)
              - max-h-[480px] (cap height for tall portrait images)
              - h-auto + w-auto  (preserve natural aspect ratio)
              - object-contain  (show full image, no cropping)
            Result: a 690×1358 portrait renders ~245px wide × 480px tall,
            centered, with the bg-muted filling remaining horizontal space. */}
        {blog.photo && (
          <div className="w-full rounded-2xl overflow-hidden  mb-12  flex items-center justify-center min-h-[200px]">
            <img
              src={blog.photo}
              alt={blog.title}
              className="max-w-full max-h-[480px] w-auto h-auto object-contain block"
            />
          </div>
        )}

        {/* Blog Content — scoped with data-blog-body */}
        <div className="pb-20">
          <div
            data-blog-body
            className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-4
              prose-h2:text-3xl prose-h2:mt-8  prose-h2:mb-3
              prose-h3:text-2xl prose-h3:mt-6  prose-h3:mb-2
              prose-p:leading-relaxed prose-p:my-4
              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-a:font-medium prose-a:no-underline
              hover:prose-a:underline hover:prose-a:text-blue-500
              dark:hover:prose-a:text-blue-300
              prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6
              prose-ol:list-decimal prose-ol:pl-6
              prose-blockquote:border-l-4
              prose-blockquote:border-blue-500
              dark:prose-blockquote:border-blue-400
              prose-blockquote:italic
              prose-blockquote:text-muted-foreground
              prose-code:before:content-none
              prose-code:after:content-none"
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
