import z from "zod";


export const signUpSchema = z.object({
    name:z.string().min(2,"Name length must be greater than 2"),
    email: z.string().email({message:'Invalid email'}),
  password: z.string().min(6,'Password length must be greater than 6'),
});