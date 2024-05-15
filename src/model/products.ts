import pool from "../db/pool";

interface IProduct {
  id: number;
  name: string;
  expiration_date: Date;
  batch: number;
}

export const createProduct = async (
  name: string,
  expiration_date: Date,
  batch: number
): Promise<IProduct> => {
  const queryText =
    "INSERT INTO products (name, expiration_date, batch) values ($1, $2, $3) RETURNING *";
  const { rows } = await pool.query(queryText, [name, expiration_date, batch]);
  return rows[0];
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  const { rows } = await pool.query("SELECT * FROM products");
  return rows;
};

export const getProductsByName = async (name: string): Promise<IProduct[]> => {
  const { rows } = await pool.query("SELECT * FROM products WHERE name = $1");
  return rows;
};

export const getProductById = async (id: number): Promise<IProduct> => {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1");
  return rows[0];
};