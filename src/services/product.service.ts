import { ProductModel } from "../models/product.model.js";
import type { productoQueryParams } from "../schemas/product.schema.js";
import type { paginaResult, Producto } from "../models/product.model.js";

export const productService = {
  createProduct: async function name(
    nombre: string,
    descripcion: string,
    precio_unitario: number,
  ): Promise<Producto> {
    // ELIMINA LOS ESPACIOS VACIOS DE NOMBRE Y DE CATEGORIA
    const cleanNombre = nombre.trim();
    const cleanCategoria = descripcion.trim();

    //EVITA QUE SE CREEN 2 PRODUCTOS CON EL MISMO NOMBRE
    const productExist = await ProductModel.findByName(nombre);
    if (productExist) {
      throw new Error("Este producto ya existe");
    }
    return await ProductModel.insertProduct({
      nombre,
      descripcion,
      precio_unitario,
    });
  },

  getProductFilters: async (
    query: productoQueryParams,
  ): Promise<paginaResult<Producto>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    return await ProductModel.findWhitFilter(page, limit, maxPrice);
  },
};
