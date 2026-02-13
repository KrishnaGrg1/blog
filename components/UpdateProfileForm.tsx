"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import UploadButton from "./avatar-uploader";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function UpdateProfileForm({
  user,
}: {
  user: { id: string; name: string; email: string; image: string | null };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(user.image || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/user/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update profile");

        toast.success("Profile updated successfully");
        router.refresh();
      } catch (error) {
        toast.error("Failed to update profile");
      }
    });
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 ring-4 ring-slate-100">
          <AvatarImage src={imageUrl || undefined} alt={user.name} />
          <AvatarFallback className=" text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <UploadButton
            uploadPreset={
              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog"
            }
            onUploadSuccess={(result: any) => {
              const url = result.info.secure_url;
              setImageUrl(url);
              setValue("image", url);
              toast.success("Image uploaded successfully");
            }}
          />
          <p className="text-xs text-slate-500">
            JPG, PNG or WEBP. Max size 5MB.
          </p>
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="John Doe"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john@example.com"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
        <p className="text-xs text-slate-500">
          Changing your email will require verification
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
