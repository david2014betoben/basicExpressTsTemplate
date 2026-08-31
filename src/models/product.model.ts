import { pool } from "../config/db.js";
import type { updateProductoSchema } from "../schemas/product.schema.js";
import type { z } from "zod";

//TIPADO DE LA TABLA
export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
}
export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// apartir de el tipado crear otros types
export type CreateProductoInput = Omit<Producto, "id_producto">;
export type UpdateProductoInput = z.infer<typeof updateProductoSchema>;

//FUNCIONES Q CONSULTAN A LA BASE DE DATOS
export const ProductModel = {
  getAllProducts: async (): Promise<Producto[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM productos ORDER BY id_producto ASC;",
    );
    return rows;
  },
  getProductById: async (id: number): Promise<Producto | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM productos WHERE id_producto = $1;",
      [id],
    );
    return rows[0] || null;
  },
  insertProduct: async (dato: CreateProductoInput): Promise<Producto> => {
    const { nombre, descripcion, precio_unitario } = dato;
    const query =
      "INSERT INTO productos (nombre, descripcion, precio_unitario) VALUES ($1,$2,$3) RETURNING *;";
    const { rows } = await pool.query(query, [
      nombre,
      descripcion,
      precio_unitario,
    ]);
    return rows[0];
  },
  updateProduct: async (
    id: number,
    dato: UpdateProductoInput,
  ): Promise<Producto | null> => {
    const campos = Object.keys(dato) as (keyof UpdateProductoInput)[];

    const setClause = campos
      .map((campo, i) => `${campo} = $${i + 1}`)
      .join(", ");
    const valores = campos.map((campo) => dato[campo]);

    const { rows } = await pool.query(
      `UPDATE productos
            SET ${setClause}
            WHERE id_producto = $${campos.length + 1}
            RETURNING *;
`,
      [...valores, id],
    );
    return rows[0] || null;
  },
  findByName: async (name: string): Promise<Producto | null> => {
    const { rows } = await pool.query<Producto>(
      "SELECT * FROM productos WHERE LOWER(nombre) = LOWER($1);",
      [name],
    );
    return rows[0] || null;
  },

  findWhitFilter: async (
    page: number = 1,
    limit: number = 10,
    maxPrice?: number, // where total <= ${maxTotal}
  ): Promise<paginaResult<Producto>> => {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // la construccion de las condiciones
    if (maxPrice !== undefined) {
      conditions.push(`precio_unitario <= $${paramIndex}`);
      paramIndex++;
      values.push(maxPrice);
    }

    // unir las condiciones existentes con AND
    const whereUnited =
      conditions.length > 0 ? `WHERE ${conditions.join(` AND `)}` : "";

    // CONTEO TOTAL de pedidos que coinciden con los filtros aplicados
    const countQuery = `SELECT COUNT(*) FROM productos ${whereUnited}`;
    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].count);

    // consulta de datos con limit y offset
    const offset = (page - 1) * limit;

    // agregar el limit y offset a los placeholder dinamicos
    const dataValues = [...values, limit, offset];

    const dataQuery = `
    SELECT * FROM productos
    ${whereUnited}
    ORDER BY id_producto ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

    const { rows } = await pool.query(dataQuery, dataValues);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
};
