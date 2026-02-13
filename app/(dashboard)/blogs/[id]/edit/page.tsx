import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import EditBlogForm from "@/components/EditBlog";
import { headers } from "next/headers";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) notFound();

  const blog = await prisma.blog.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!blog) notFound();

  return <EditBlogForm blog={{
    ...blog,
    photo: blog.photo ?? undefined,
    seoKeywords: blog.seoKeywords ?? undefined,
  }} />;
}
