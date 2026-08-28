import { email, z } from "zod";

export const createCustomerSchema = z.object({
  nombre: z
    .string({
      message: "El nombre debe ser obligatorio",
    })
    .min(3, "el nombre debe tener almenos 3 caracteres")
    .trim()
    .min(1),
  ap_paterno: z
    .string({
      message: "El apellido paterno debe ser obligatorio",
    })
    .min(3, "el apellido paterno debe tener almenos 3 caracteres")
    .trim()
    .min(1),
  ap_materno: z
    .string()
    .min(3, "el apellido materno debe tener almenos 3 caracteres")
    .trim()
    .min(1)
    .optional(),
  email: z
    .string()
    .min(3, "el email debe tener almenos 3 caracteres")
    .trim()
    .min(1)
    .optional(),
  telefono: z
    .string()
    .min(3, "el telefono debe tener almenos 3 caracteres")
    .trim()
    .min(1)
    .optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
