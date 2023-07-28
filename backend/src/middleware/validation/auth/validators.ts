import { z } from 'zod'

// Mail input when reseting password
export const FormSchemaMailInput = z.object({
    email: z.string().email(),
})
export type TMailInputData = z.infer<typeof FormSchemaMailInput>

// Login data
export const FormSchemaLoginData = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: 'Password needs to be at least 8 characthers' }),
})
export type TLoginUserData = z.infer<typeof FormSchemaLoginData>

// Register data
export const FormSchemaRegisterData = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, { message: 'First name need to be at least 2 chars' }),
    lastName: z
        .string()
        .trim()
        .min(2, { message: 'Last name needs to be at least 2 chars' }),
    password: z
        .string()
        .min(8, { message: 'Password needs to be at least 8 characthers' }),
    email: z.string().email(),
})

export type TRegisterUserData = z.infer<typeof FormSchemaRegisterData>

// Change Password
export const FormSchemaPasswordChange = z.object({
    password: z
        .string()
        .min(8, { message: 'Password needs to be at least 8 characthers' }),
    confirm: z.string().min(8),
    token: z.string(),
})

export type TChangePasswordData = z.infer<typeof FormSchemaPasswordChange>
