import type { Request, Response, NextFunction } from "express";

export function validateSale(req: Request, res: Response, next: NextFunction) {
  const { id_cliente, estado } = req.body;

  // Verificar que exista al menos un campo
  if (id_cliente === undefined && estado === undefined) {
    res.status(400).json({
      error: "Se debe ingresar al menos un dato para actualizar",
    });
    return;
  }

  // Validar id_cliente si fue enviado
  if (id_cliente !== undefined) {
    if (typeof id_cliente !== "number") {
      res.status(400).json({
        error: "El id del cliente debe ser un número",
      });
      return;
    }

    if (id_cliente <= 0) {
      res.status(400).json({
        error: "El id del cliente debe ser mayor a 0",
      });
      return;
    }
  }

  // Validar estado si fue enviado
  if (estado !== undefined) {
    if (typeof estado !== "boolean") {
      res.status(400).json({
        error: "El estado debe ser verdadero o falso",
      });
      return;
    }
  }

  next();
}
