import { pool } from "../config/db.js";

//TIPADO DE LA TABLA
export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
}
// apartir de el tipado crear otros types
export type CreateProductoInput = Omit<Producto, "id_producto">;
export type UpdateProductoInput = Partial<CreateProductoInput>;

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
    const { rows } = await pool.query(
      `UPDATE productos
            SET nombre = $1,
            descripcion = $2,
            precio_unitario = $3
            WHERE id_producto = $4
            RETURNING *;
`,
      [dato.nombre, dato.descripcion, dato.precio_unitario, id],
    );
    return rows[0] || null;
  },
};
