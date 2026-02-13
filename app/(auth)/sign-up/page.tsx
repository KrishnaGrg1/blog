"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/auth.actions";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "./schema";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
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
import { FileText, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

type FormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function handleSubmit(data: FormData) {
    startTransition(async () => {
      try {
        const result = await signUp(data);
        if (result.success) {
          toast.success("Account created successfully");
          router.push("/blogs");
          router.refresh();
        } else {
          toast.error(
            result.message || result.message || "Failed to create account",
          );
          form.setError("root", {
            message: result.message || result.message,
          });
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to create account");
      }
    });
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold ">Create Account</h1>
          <p className="mt-2">Start your blogging journey with BlogHub</p>
        </div>

        {/* Sign Up Card */}
        <Card className="border-slate-200 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="sign-up-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FieldGroup>
                {/* Name Field */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Full Name</FieldLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 " />
                        <Input
                          {...field}
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email Field */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email Address</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 " />
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password Field */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 " />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Create a password"
                          className="pl-10"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              {form.formState.errors.root?.message ? (
                <p className="text-destructive text-sm text-center">
                  {form.formState.errors.root.message}
                </p>
              ) : (
                []
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              form="sign-up-form"
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-sm ">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium  hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs ">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline ">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline ">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
