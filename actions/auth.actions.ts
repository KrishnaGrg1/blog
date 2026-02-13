"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (data: { email: string; password: string }) => {
    try {
        await auth.api.signInEmail({
            body: {
                email: data.email,
                password: data.password
            },
            asResponse: true,
            headers: await headers()
        });
        
        return { success: true };
    } catch (error: any) {
        return { 
            success: false, 
            error: { message: error?.message || "Failed to sign in" } 
        };
    }
}

export const signUp = async (data: { name: string; email: string; password: string }) => {
   try{

       await auth.api.signUpEmail({
           body: {
               name: data.name,
               email: data.email,
               password: data.password
            }
        })
        return { success: true };
    }
    catch (error: any) {
        return { 
            success: false, 
            error: { message: error?.message || "Failed to sign in" } 
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
