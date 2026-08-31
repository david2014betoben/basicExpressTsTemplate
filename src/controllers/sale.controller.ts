import type { Request, Response } from "express";
import { SaleModel } from "../models/sale.model.js";
import { createSaleSchema, updateSaleSchema } from "../schemas/sale.schema.js";

export async function getSale(req: Request, res: Response) {
  /*#swagger.tags = ['Sales']
  #swagger.summary = 'TRAE TODOS LOS PEDIDOS' */
  try {
    const sales = await SaleModel.getAllSales();

    res.json({
      totalSales: sales.length,
      data: sales,
    });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ", error);

    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getSaleId(req: Request, res: Response) {
  /*#swagger.tags = ['Sales']
  #swagger.summary = 'TRAE UN PEDIDO ESPECIFICO CON EL ID' */
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "el id debe ser numerico",
      });
      return;
    }

    const sale = await SaleModel.getSaleById(id);

    if (!sale) {
      res.status(404).json({
        error: "pedido no encontrado",
      });
      return;
    }

    res.json({
      data: sale,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export async function createSale(req: Request, res: Response) {
  /*#swagger.tags = ['Sales']
  #swagger.summary = 'CREA UN NUEVO PEDIDO' */
  try {
    const result = createSaleSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues,
      });
    }

    const newSale = await SaleModel.insertSale(result.data);

    res.status(201).json({
      data: newSale,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export async function updateSale(req: Request, res: Response) {
  /*#swagger.tags = ['Sales']
  #swagger.summary = 'ACTUALIZA UN PEDIDO EXISTENTE' */
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "EL ID DEBE SER UN VALOR NUMERICO",
      });
      return;
    }

    const result = updateSaleSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues,
      });
    }

    const saleUpdate = await SaleModel.updateSale(id, result.data);

    if (!saleUpdate) {
      res.status(404).json({
        error: "pedido no encontrado",
      });
      return;
    }

    res.json({
      data: saleUpdate,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
