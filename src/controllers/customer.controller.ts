import type { Request, Response } from "express";
import { CustomerModel } from "../models/customer.model.js";
import { createCustomerSchema } from "../schemas/customer.schema.js";

export async function getCustomer(req: Request, res: Response) {
  /*#swagger.tags = ['Customers']
  #swagger.summary = 'TRAE TODOS LOS CLIENTES' */
  try {
    const customer = await CustomerModel.getAllCustomers();
    res.json({ totalCustomer: customer.length, data: customer });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getCustomerId(req: Request, res: Response) {
  /*#swagger.tags = ['Customers']
  #swagger.summary = 'TRAE UN CLIENTE ESPECIFICO CON EL ID' */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el id debe ser numerico" });
      return;
    }
    const customer = await CustomerModel.getCustomerById(id);
    if (!customer) {
      res.status(400).json({ error: "cliente no encontrado" });
      return;
    }
    res.json({ data: customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCustomer(req: Request, res: Response) {
  /*#swagger.tags = ['Customers']
  #swagger.summary = 'CREA UN NUEVO CLIENTE' */
  try {
    const result = createCustomerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const newCustomer = await CustomerModel.insertCustomer(result.data);
    res.status(201).json({ data: newCustomer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateCustomer(req: Request, res: Response) {
  /*#swagger.tags = ['Customers']
  #swagger.summary = 'ACTUALIZA UN CLIENTE EXISTENTE' */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const { nombre, ap_paterno, ap_materno, email, telefono } = req.body;
    const customerUpdate = await CustomerModel.updateCustomer(id, {
      nombre,
      ap_paterno,
      ap_materno,
      email,
      telefono,
    });
    if (!customerUpdate) {
      res.status(404).json({ error: "cliente no encontrado" });
      return;
    }
    res.json({ data: customerUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
