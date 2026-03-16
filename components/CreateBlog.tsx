"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createBlogSchema,
  CreateBlogInput,
} from "@/app/(dashboard)/blogs/[id]/edit/schema";
import { CreateBlog } from "@/actions/blog.actions";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import UploadButton from "./avatar-uploader";
import RichTextEditor from "./RichTextEditor";

// Converts a title into a URL-safe slug
function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CreateBlogForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      photo: "",
      seoKeywords: "",
      published: false,
    },
  });

  // Auto-generate slug from title when slug field is empty
  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (...args: unknown[]) => void,
  ) => {
    fieldOnChange(e);
    const currentSlug = form.getValues("slug");
    if (!currentSlug) {
      form.setValue("slug", toSlug(e.target.value), { shouldValidate: false });
    }
  };

  const onSubmit = (data: CreateBlogInput) => {
    startTransition(async () => {
      try {
        await CreateBlog(data);
        toast.success("Blog created successfully");
        router.push("/blogs");
      } catch (err) {
        // BUG FIX: error handler was commented out — restored
        console.error(err);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    // BUG FIX: CardFooter must be OUTSIDE CardContent, otherwise it
    // gets double-padded and the border-top doesn't render correctly.
    <Card>
      <CardHeader>
        <CardTitle>Create Blog</CardTitle>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup className="space-y-5">
            {/* Title — with auto-slug generation */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    {...field}
                    placeholder="My awesome blog title"
                    onChange={(e) => handleTitleChange(e, field.onChange)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Slug */}
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Slug
                    <span className="ml-1 text-xs text-muted-foreground font-normal">
                      (auto-generated from title)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="my-awesome-blog"
                    onChange={(e) => field.onChange(toSlug(e.target.value))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Description
                    <span className="ml-1 text-xs text-muted-foreground font-normal">
                      (shown as subtitle on the post)
                    </span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="A short description shown below the title"
                    rows={2}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Content */}
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Content</FieldLabel>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Start writing your blog content..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Cover photo */}
            <Controller
              name="photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Cover Photo</FieldLabel>
                  <div className="space-y-3">
                    <UploadButton
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                        "blog test"
                      }
                      onUploadSuccess={(result: any) => {
                        field.onChange(result.info.secure_url);
                        toast.success("Image uploaded successfully");
                      }}
                      //   onUploadError={(error: any) => {
                      //     console.error("Upload error:", error);
                      //     toast.error("Failed to upload image");
                      //   }}
                    />

                    {field.value && (
                      <div className="flex items-start gap-3">
                        <img
                          src={field.value}
                          alt="Cover preview"
                          className="h-24 w-40 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange("")}
                        >
                          Remove
                        </Button>
                      </div>
                    )}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />

            {/* SEO Keywords */}
            <Controller
              name="seoKeywords"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    SEO Keywords
                    <span className="ml-1 text-xs text-muted-foreground font-normal">
                      (comma-separated)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="nestjs, typescript, saas, webdev"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Published toggle */}
            <Controller
              name="published"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FieldLabel className="mb-0">
                        Publish immediately
                      </FieldLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        If off, post is saved as a draft
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>

        {/* BUG FIX: CardFooter is now correctly outside CardContent */}
        <CardFooter className="border-t bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Blog"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
