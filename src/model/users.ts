import pool from "../db/pool";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string[];
}

export const createsUser = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<IUser> => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const queryText =
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *";
  const { rows } = await pool.query(queryText, [
    name,
    email,
    encryptedPassword,
    role,
  ]);
  return rows[0];
};

export const authenticatesUser = async (
  email: string,
  password: string
): Promise<String> => {
  const userQueryText = "SELECT * FROM users WHERE email=$1";
  const { rows } = await pool.query(userQueryText, [email]);
  const user = rows[0];

  if (!user) {
    throw new Error("Invalid credentials!");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid password, please try again!");
  }

  const payload = { id: user.id, name: user.name, role: user.role };
  const secret =
    process.env.JWT_SECRET ||
    "53B71FB31FA20B3EA74319BC9551F5E1EB4046D1F16E81AFCF45CD4C2568B9AE";
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return token;
};

export const createsAdmin = async (
  name: string,
  email: string,
  password: string
): Promise<IUser> => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const queryText =
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'admin') RETURNING *";
  const { rows } = await pool.query(queryText, [
    name,
    email,
    encryptedPassword,
  ]);
  return rows[0];
};

export const createsManager = async (
  name: string,
  email: string,
  password: string
): Promise<IUser> => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const queryText =
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'manager') RETURNING *";
  const { rows } = await pool.query(queryText, [
    name,
    email,
    encryptedPassword,
  ]);
  return rows[0];
};

export const createsStocker = async (
  name: string,
  email: string,
  password: string
): Promise<IUser> => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const queryText =
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'stocker') RETURNING *";
  const { rows } = await pool.query(queryText, [
    name,
    email,
    encryptedPassword,
  ]);
  return rows[0];
};

export const createsCashier = async (
  name: string,
  email: string,
  password: string
): Promise<IUser> => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const queryText =
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'cashier') RETURNING *";
  const { rows } = await pool.query(queryText, [
    name,
    email,
    encryptedPassword,
  ]);
  return rows[0];
};

//TODO: Implement the following functions
// updatesUser, updatesManager, updatesStocker, updatesCashier -- done
// deletesUser, deletesManager, deletesStocker, deletesCashier
// updatePassword, updateRole, updateEmail -- done
// getsAllWorkers, getsAllAdmins, getsAllManagers, getsAllStockers, getsAllCashiers
// getWorkerById, getAdminById, getManagerById, getStockerById, getCashierById
//getWorkerByName, getManagerByName, getStockerByName, getCashierByName

//update:

export const updatesUser = async (
  id: number,
  name: string,
  email: string
): Promise<void> => {
  const queryText = "UPDATE users SET name=$2, email=$3 WHERE id=$1";
  await pool.query(queryText, [id, name, email]);
};

export const updatesManager = async (
  id: number,
  name: string,
  email: string
): Promise<void> => {
  const queryText = "UPDATE users SET name=$2, email=$3 WHERE id=$1";
  await pool.query(queryText, [id, name, email]);
};

export const updatesStocker = async (
  id: number,
  name: string,
  email: string
): Promise<void> => {
  const queryText = "UPDATE users SET name=$2, email=$3 WHERE id=$1";
  await pool.query(queryText, [id, name, email]);
};

export const updatesCashier = async (
  id: number,
  name: string,
  email: string
): Promise<void> => {
  const queryText = "UPDATE users SET name=$2, email=$3 WHERE id=$1";
  await pool.query(queryText, [id, name, email]);
};

export const updatesEmail = async (
  id: number,
  email: string
): Promise<void> => {
  const queryText = "UPDATE users SET email=$2 WHERE id=$1";
  await pool.query(queryText, [id, email]);
};

export const updatesPassword = async (
  id: number,
  password: string
): Promise<void> => {
  const queryText = "UPDATE users SET password=$2 WHERE id=$1";
  await pool.query(queryText, [id, password]);
};

export const updatesRole = async (id: number, role: string): Promise<void> => {
  const queryText = "UPDATE users SET role=$2 WHERE id=$1";
  await pool.query(queryText, [id, role]);
};
