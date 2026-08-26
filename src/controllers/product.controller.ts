import type { Request, Response } from "express";
import { ProductModel } from "../models/product.model.js";
import { createProductoSchema } from "../schemas/product.schema.js";

export async function getMenu(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
  #swagger.summary = 'TRAE TODO EL MENU' */
  try {
    const product = await ProductModel.getAllProducts();
    res.json({ totalProductos: product.length, data: product });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getProduct(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
  #swagger.summary = 'TRAE UN PRODUCTO ESPECIFICO CON EL ID' */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el id debe ser numerico" });
      return;
    }
    const product = await ProductModel.getProductById(id);
    if (!product) {
      res.status(400).json({ error: "producto no encotnrado" });
      return;
    }
    res.json({ data: product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createProduct(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
  #swagger.summary = 'CREA UN NUEVO PRODUCTO' */
  try {
    const result = createProductoSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const newProduct = await ProductModel.insertProduct(result.data);
    res.status(201).json({ data: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProduct(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
  #swagger.summary = 'ACTUALIZA UN PRODUCTO EXISTENTE' */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const { nombre, descripcion, precio_unitario } = req.body;
    const productoUpdate = await ProductModel.updateProduct(id, {
      nombre,
      descripcion,
      precio_unitario,
    });
    if (!productoUpdate) {
      res.status(404).json({ error: "producto no encontrado" });
      return;
    }
    res.json({ data: productoUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
