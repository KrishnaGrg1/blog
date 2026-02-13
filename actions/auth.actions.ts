"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (data: {
  email: string;
  password: string;
}) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });
    return { success: true };
  } catch {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
};

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    return {
      success: false,
      message: error?.message || "Failed to create account",
    };
  }
}


export const signOut = async () => {
    try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
  redirect("/sign-in");
}
