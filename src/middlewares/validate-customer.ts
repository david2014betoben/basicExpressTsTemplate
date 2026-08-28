import type { Request, Response, NextFunction } from "express";

export function validateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { nombre, ap_paterno, ap_materno, email, telefono } = req.body;
  //1 existen los 3 valores q me llegan en la solicitud
  if (!ap_paterno || !nombre) {
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
  if (typeof ap_materno !== "string" || ap_materno.trim() === "") {
    res.status(400).json({
      error: "el campo apellido materno debe ser un texto valido",
    });
    return;
  }
  if (typeof email !== "string" || email.trim() === "") {
    res.status(400).json({
      error: "el campo email debe ser un texto valido",
    });
    return;
  }
  if (typeof telefono !== "string" || telefono.trim() === "") {
    res.status(400).json({
      error: "el campo telefono debe ser un texto valido",
    });
    return;
  }
  if (typeof ap_paterno !== "string" || ap_paterno.trim() === "") {
    res.status(400).json({
      error: "el campo apellido paterno debe ser un texto valido",
    });
    return;
  }
  next();
}
