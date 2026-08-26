import type { Request, Response, NextFunction } from "express";

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { precio_unitario, descripcion, nombre } = req.body;
  //1 existen los 3 valores q me llegan en la solicitud
  if (precio_unitario === undefined || !descripcion || !nombre) {
    res.status(400).json({ error: "Faltan campos Obligatorios" });
    return;
  }

  //2 tipos de datos
  if (typeof nombre !== "string" || nombre.trim() === "") {
    res.status(400).json({
      error: "el campo nombre debe ser un texto valido",
    });
    return;
  }
  if (typeof precio_unitario !== "number" || precio_unitario < 0) {
    res
      .status(400)
      .json({ error: "el precio debe ser un valor numerico positivo" });
    return;
  }
  if (typeof descripcion !== "string" || descripcion.trim() === "") {
    res.status(400).json({
      error: "el campo categoria debe ser un texto valido",
    });
    return;
  }
  next();
}
