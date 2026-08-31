import { z } from "zod";

export const createSaleSchema = z.object({
  id_cliente: z
    .number({
      message: "El id del cliente es obligatorio",
    })
    .positive("El id del cliente debe ser mayor a 0"),
});

export const updateSaleSchema = createSaleSchema
  .extend({
    estado: z.boolean({
      message: "El estado debe ser verdadero o falso",
    }),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "SE DEBE INGRESAR AL MENOS UN DATO PARA ACTUALIZAR",
  });
