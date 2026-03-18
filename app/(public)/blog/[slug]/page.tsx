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
    /*
      overflow-x-hidden on the root div is the key mobile fix —
      it stops any child from ever pushing the page wider than the viewport.
    */
    <div className="min-h-screen overflow-x-hidden">
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

      {/* w-full instead of max-w-5xl mx-auto here so it never creates
          a shifted sub-column that overflows on narrow screens */}
      <article className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Meta + Title ─────────────────────────────────────────── */}
        <div className="py-8 sm:py-12 space-y-6 sm:space-y-8">
          {/* Meta row — wraps gracefully on mobile */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <time dateTime={blog.createdAt.toISOString()}>
                {formattedDate}
              </time>
            </div>
            <Separator
              orientation="vertical"
              className="h-4 hidden sm:inline"
            />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{readingTime} min read</span>
            </div>
            {blog.user?.name && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-4 hidden sm:inline"
                />

                <div className="flex items-center gap-1.5">
                  {blog.user.image && (
                    <img
                      src={blog.user.image}
                      alt={blog.user.name}
                      className="h-5 w-5 rounded-full object-cover shrink-0"
                    />
                  )}
                  <span>By {blog.user.name}</span>
                </div>
              </>
            )}
          </div>

          {/*
            TITLE — mobile-first sizing:
            - text-3xl  on mobile  (~30px) — fits within ~390px screens
            - text-4xl  on sm      (~36px)
            - text-5xl  on lg      (~48px)
            Removed text-6xl which was causing the right-side overflow
          */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
            {blog.title}
          </h1>

          {/* Description — clamp width so it never overflows */}
          {blog.description && (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed w-full">
              {blog.description}
            </p>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="rounded-full text-xs"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* ── Cover Image ──────────────────────────────────────────────
            Portrait images (e.g. 690×1358): max-h caps height,
            w-auto + object-contain keeps correct aspect ratio, centered. */}
        {blog.photo && (
          <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl mb-8 sm:mb-12 bg-muted flex items-center justify-center min-h-[160px] sm:min-h-[200px]">
            <img
              src={blog.photo}
              alt={blog.title}
              className="max-w-full max-h-[360px] sm:max-h-[480px] w-auto h-auto object-contain block"
            />
          </div>
        )}

        {/* ── Blog Content ─────────────────────────────────────────────
            data-blog-body scopes the CSS overrides in blog-content.css
            prose-sm on mobile, prose-lg on sm+ for readable line length */}
        <div className="pb-16 sm:pb-20">
          <div
            data-blog-body
            className="
              prose prose-sm sm:prose-lg max-w-none dark:prose-invert

              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-2xl sm:prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-3
              prose-h2:text-xl  sm:prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-2
              prose-h3:text-lg  sm:prose-h3:text-2xl prose-h3:mt-5 prose-h3:mb-2

              prose-p:leading-relaxed prose-p:my-3 sm:prose-p:my-4

              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-a:font-medium prose-a:no-underline
              hover:prose-a:underline hover:prose-a:text-blue-500
              dark:hover:prose-a:text-blue-300

              prose-strong:font-semibold

              prose-ul:list-disc   prose-ul:pl-5 sm:prose-ul:pl-6
              prose-ol:list-decimal prose-ol:pl-5 sm:prose-ol:pl-6

              prose-blockquote:border-l-4
              prose-blockquote:border-blue-500
              dark:prose-blockquote:border-blue-400
              prose-blockquote:italic
              prose-blockquote:text-muted-foreground

              prose-code:before:content-none
              prose-code:after:content-none
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Footer */}
        <div className="border-t py-6 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Published on {formattedDate}
            </div>
            <Link href="/blog">
              <Button variant="outline" size="sm" className="gap-2">
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
