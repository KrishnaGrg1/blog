"use client";

import { Controller, useForm } from "react-hook-form";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditBlog } from "@/actions/blog.actions";
import { toast } from "sonner";
import { updateBlogSchema } from "@/app/(dashboard)/blogs/[id]/edit/schema";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import UploadButton from "./avatar-uploader";

type FormData = z.infer<typeof updateBlogSchema>;

export default function EditBlogForm({ blog }: { blog: FormData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(updateBlogSchema),
    defaultValues: {
      ...blog,
      photo: blog.photo ?? "",
      seoKeywords: blog.seoKeywords ?? "",
    },
  });

  const handleSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await EditBlog(data);
        toast.success("Blog updated successfully");
        router.refresh();
      } catch (err) {
        toast.error("Something went wrong");
      }
    });
  };

  const currentPhotoValue = form.watch("photo");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <input type="hidden" {...form.register("id")} />

          <FieldGroup>
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} placeholder="Blog Title" />
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
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full rounded-md border px-3 py-2"
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
                  <FieldLabel>Slug</FieldLabel>
                  <Input {...field} placeholder="blog-slug" />
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
                  <textarea
                    {...field}
                    rows={8}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* SEO Keywords */}
            <Controller
              name="seoKeywords"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>SEO Keywords</FieldLabel>
                  <Input {...field} placeholder="keyword1, keyword2" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Photo Upload */}
            <Controller
              name="photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Blog Photo</FieldLabel>
                  <div className="space-y-4">
                    {/* Current Photo Preview */}
                    {currentPhotoValue && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Current Photo:
                        </p>
                        <div className="relative">
                          <img
                            src={currentPhotoValue}
                            alt="Current blog photo"
                            className="h-48 w-auto object-cover rounded-md border"
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload/Replace Button */}
                    <div className="flex items-center gap-2">
                      <UploadButton
                        uploadPreset={
                          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                          "blog test"
                        }
                        onUploadSuccess={(result: any) => {
                          field.onChange(result.info.secure_url);
                          toast.success("Image uploaded successfully");
                        }}
                      />

                      {currentPhotoValue && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            field.onChange("");
                            toast.info("Photo removed");
                          }}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />

            {/* Published Switch */}
            <Controller
              name="published"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(val)}
                    />
                    Published
                  </label>
                </Field>
              )}
            />
          </FieldGroup>

          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating Blog..." : "Update Blog"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
