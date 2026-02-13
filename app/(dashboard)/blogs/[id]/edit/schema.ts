import { z } from "zod";

/* ---------------------------------- */
/* Base Blog Fields (Reusable Shape)  */
/* ---------------------------------- */

const baseBlogFields = {
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title too long"),

  slug: z
    .string()
    .min(3)
    .max(160)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and hyphen-separated"
    ),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description too long"),

  content: z
    .string()
    .min(50, "Content must be at least 50 characters"),

  photo: z
    .string()
    .url("Photo must be a valid URL")
    .optional()
    .or(z.literal("")),

  seoKeywords: z
    .string()
    .max(300)
    .optional()
    .or(z.literal("")),

  published: z.boolean().optional(),
};

/* ---------------------------------- */
/* Create Blog Schema                 */
/* ---------------------------------- */

export const createBlogSchema = z.object(baseBlogFields);

/* ---------------------------------- */
/* Update Blog Schema                 */
/* ---------------------------------- */

export const updateBlogSchema = z.object({
  id: z.string().cuid("Invalid blog ID"),
  ...baseBlogFields,
});

/* ---------------------------------- */
/* Blog Param Schema (for slug page)  */
/* ---------------------------------- */

export const blogSlugParamSchema = z.object({
  slug: baseBlogFields.slug,
});

/* ---------------------------------- */
/* Type Exports                       */
/* ---------------------------------- */

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
