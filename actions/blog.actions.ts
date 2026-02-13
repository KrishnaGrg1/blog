

"use server";

import { CreateBlogInput, updateBlogSchema } from "@/app/(dashboard)/blogs/[id]/edit/schema";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteBlog(id: string) {
  const session = await auth.api.getSession({
    headers:await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.blog.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/blogs");
  return { success: true };
}




export async function EditBlog(data: unknown) {
  const session = await auth.api.getSession({
    headers:await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = updateBlogSchema.parse(data);

  const blog = await prisma.blog.findFirst({
    where: {
      id: validated.id,
      userId: session.user.id,
    },
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  await prisma.blog.update({
    where: { id: validated.id },
    data: {
      title: validated.title,
      description: validated.description,
      slug: validated.slug,
      content: validated.content,
      photo: validated.photo,
      seoKeywords: validated.seoKeywords,
      published: validated.published,
    },
  });

  return { success: true };

}


export async function CreateBlog(data: CreateBlogInput) {
  const session = await auth.api.getSession({
    headers:await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.blog.create({
    data: {
      title: data.title,
      description: data.description,
      slug: data.slug,
      content: data.content,
      photo: data.photo || "",
      seoKeywords: data.seoKeywords,
      published: data.published,
      userId:session.user.id
    },
  });

  return { success: true };
}