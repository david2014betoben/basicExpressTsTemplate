import { pool } from "../config/db.js";

// TIPADO DE LA RESPUESTA
export interface Sale {
  id_pedido: number;
  nombre_cliente: string;
  fecha: Date;
  estado: boolean;
}

// DATOS PARA CREAR
export type CreateSaleInput = {
  id_cliente: number;
};

// DATOS PARA ACTUALIZAR
export type UpdateSaleInput = {
  id_cliente?: number | undefined;
  estado?: boolean | undefined;
};

// FUNCIONES QUE CONSULTAN A LA BASE DE DATOS
export const SaleModel = {
  getAllSales: async (): Promise<Sale[]> => {
    const { rows } = await pool.query(`
      SELECT 
        p.id_pedido,
        CONCAT_WS(
          ' ',
          c.nombre,
          c.ap_paterno,
          c.ap_materno
        ) AS nombre_cliente,
        p.fecha,
        p.estado
      FROM pedidos p
      INNER JOIN clientes c
        ON p.id_cliente = c.id_cliente
      ORDER BY p.id_pedido ASC;
    `);

    return rows;
  },

  getSaleById: async (id: number): Promise<Sale | null> => {
    const { rows } = await pool.query(
      `
      SELECT 
        p.id_pedido,
        CONCAT_WS(
          ' ',
          c.nombre,
          c.ap_paterno,
          c.ap_materno
        ) AS nombre_cliente,
        p.fecha,
        p.estado
      FROM pedidos p
      INNER JOIN clientes c
        ON p.id_cliente = c.id_cliente
      WHERE p.id_pedido = $1;
      `,
      [id],
    );

    return rows[0] || null;
  },

  insertSale: async (dato: CreateSaleInput): Promise<Sale> => {
    const { id_cliente } = dato;

    const query = `
      INSERT INTO pedidos (id_cliente)
      VALUES ($1)
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id_cliente]);

    return rows[0];
  },

  updateSale: async (
    id: number,
    dato: UpdateSaleInput,
  ): Promise<Sale | undefined> => {
    const { id_cliente, estado } = dato;

    const query = `
      UPDATE pedidos
      SET 
        id_cliente = COALESCE($1, id_cliente),
        estado = COALESCE($2, estado)
      WHERE id_pedido = $3
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id_cliente, estado, id]);

    return rows[0] || undefined;
  },
};
