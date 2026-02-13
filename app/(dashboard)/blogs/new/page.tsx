import CreateBlogForm from "@/components/CreateBlog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function NewBlogPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) notFound();

  return (
    <div className="min-h-screen pt-24">
      <CreateBlogForm />
    </div>
  );
}
