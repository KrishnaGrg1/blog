"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/auth.actions";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "./schema";
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
import { FileText, Mail, Lock } from "lucide-react";
import Link from "next/link";

type FormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(data: FormData) {
    startTransition(async () => {
      try {
        const result = await signIn(data);
        if (result.success) {
          toast.success("Signed in successfully");
          router.push("/blogs");
          router.refresh();
        } else {
          toast.error(result.message || "Invalid credentials");
          form.setError("root", {
            message: result?.message || result.message,
          });
        }
      } catch (error: any) {
        toast.error(error?.message || "Invalid credentials");
      }
    });
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight ">Welcome Back</h1>
          <p className="mt-2">Sign in to continue to BlogHub</p>
        </div>

        {/* Sign In Card */}
        <Card className=" shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="sign-in-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FieldGroup>
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
                      <div className="flex items-center justify-between">
                        <FieldLabel>Password</FieldLabel>
                        {/* <Link href="/forgot-password" className="text-sm">
                          Forgot password?
                        </Link> */}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 " />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
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
              {/* Forgot Password Link */}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {form.formState.errors.root?.message && (
              <p className="text-destructive text-sm text-center">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button
              type="submit"
              form="sign-in-form"
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm ">
              Don't have an account?{" "}
              <Link href="/sign-up" className="font-medium  hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs ">
          By signing in, you agree to our{" "}
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
