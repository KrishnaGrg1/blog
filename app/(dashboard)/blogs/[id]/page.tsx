import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Blog({
  params,
}: {
  params: Promise<{ id: String }>;
}) {
  const session = await auth.api.getSession();
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: {
      id: String(id),
    },
    include: {
      user: true,
    },
  });

  if (!blog) {
    notFound;
  }
  const isAuthor = session?.user.id === blog?.userId;
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-xl shadow-sm border  p-8">
          <article>
            <header className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900">
                  {blog?.title}
                </h1>
                {isAuthor && (
                  <Link
                    href={`/blogs/${blog?.id}/edit`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium "
                  >
                    Edit Blog
                  </Link>
                )}
                {blog?.description && (
                  <>
                    <div className="h-px bg-gray-100 mb-8" />
                    <div className="prose prose-gray max-w-none">
                      {blog.description}
                    </div>
                  </>
                )}
              </div>

              {!blog?.published && (
                <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md text-sm">
                  This post is currently a draft
                </div>
              )}

              <div className="flex items-center gap-3">
                {blog?.photo ? (
                  <Image
                    src={blog?.photo}
                    alt={blog.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium">
                      {(blog?.user.name || "User").charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </header>

            {blog?.content && (
              <>
                <div className="h-px bg-gray-100 mb-8" />
                <div className="prose prose-gray max-w-none">
                  {blog.content}
                </div>
              </>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
