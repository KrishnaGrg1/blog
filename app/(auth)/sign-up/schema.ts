import z from "zod";


export const signUpSchema = z.object({
    name:z.string().min(2,"Name must be atleast 2 characters"),
    email: z.string().email({message:'Invalid email'}),
  password: z.string().min(6,'Password must be atleast 6 characters long'),
});