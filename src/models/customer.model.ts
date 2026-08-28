import { pool } from "../config/db.js";

//TIPADO DE LA TABLA
export interface Customer {
  id_cliente: number;
  nombre: string;
  ap_paterno: string;
  ap_materno?: string | undefined;
  email?: string | undefined;
  telefono?: string | undefined;
}
// apartir de el tipado crear otros types
export type CreateCustomerInput = Omit<Customer, "id_cliente">;
export type UpdateCustomerInput = Partial<CreateCustomerInput>;

//FUNCIONES Q CONSULTAN A LA BASE DE DATOS
export const CustomerModel = {
  getAllCustomers: async (): Promise<Customer[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM clientes ORDER BY id_cliente ASC;",
    );
    return rows;
  },
  getCustomerById: async (id: number): Promise<Customer | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = $1;",
      [id],
    );
    return rows[0] || null;
  },
  insertCustomer: async (dato: CreateCustomerInput): Promise<Customer> => {
    const { nombre, ap_paterno, ap_materno, email, telefono } = dato;
    const query =
      "INSERT INTO clientes (nombre, ap_paterno, ap_materno, email, telefono) VALUES ($1,$2,$3,$4,$5) RETURNING *;";
    const { rows } = await pool.query(query, [
      nombre,
      ap_paterno,
      ap_materno,
      email,
      telefono,
    ]);
    return rows[0];
  },
  updateCustomer: async (
    id: number,
    dato: UpdateCustomerInput,
  ): Promise<Customer | undefined> => {
    const { rows } = await pool.query(
      `UPDATE clientes
            SET nombre = $1,
            ap_paterno = $2,
            ap_materno = $3,
            email = $4,
            telefono = $5
            WHERE id_cliente = $6
            RETURNING *;
`,
      [
        dato.nombre,
        dato.ap_paterno,
        dato.ap_materno,
        dato.email,
        dato.telefono,
        id,
      ],
    );
    return rows[0] || undefined;
  },
};
