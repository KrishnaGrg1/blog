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
  const onSubmit = (data: CreateBlogInput) => {
    startTransition(async () => {
      try {
        await CreateBlog(data);
        toast.success("Blog created successfully");
        router.push("/blogs");
      } catch (err) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} placeholder="My awesome blog title" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Slug</FieldLabel>
                  <Input {...field} placeholder="my-awesome-blog" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Short description of your blog"
                    rows={3}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Content</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Full blog content..."
                    rows={10}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Blog Photo</FieldLabel>
                  <div className="space-y-2">
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
                      <div className="mt-2">
                        <img
                          src={field.value}
                          alt="Uploaded preview"
                          className="h-32 w-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => field.onChange("")}
                        >
                          Remove Image
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

            <Controller
              name="seoKeywords"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>SEO Keywords</FieldLabel>
                  <Input {...field} placeholder="blog, tech, coding" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="published"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={field.value} // bind form value
                      onCheckedChange={(val) => field.onChange(val)} // update form on toggle
                    />
                    Published
                  </label>
                </Field>
              )}
            />
          </FieldGroup>

          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Blog"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
