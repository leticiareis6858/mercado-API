import pool from "../db/pool";
import { getsProductById, updatesProductStatus } from "./products";
import { IProduct } from "../model/products";

export interface IPurchase {
  id: number;
  cashier_id: number;
  products: IProduct[];
  total_price: number;
}

export const createsPurchase = async (
  cashier_id: number,
  products: number[]
): Promise<IPurchase> => {
  let total_price = 0;
  const productDetails: IProduct[] = [];

  for (const productId of products) {
    const product = await getsProductById(productId);
    if (product && product.status === "available") {
      productDetails.push(product);
      let price = product.unit_selling_price;
      if (typeof price === "string") {
        price = parseFloat(price);
      }
      total_price += price;

      product.status = "sold";
      await updatesProductStatus(productId, "sold");
    } else {
      throw new Error(
        `Produto com ID ${productId} não está disponível para compra.`
      );
    }
  }

  const purchaseQueryText = `
    INSERT INTO purchases (cashier_id, total_price)
    VALUES ($1, $2)
    RETURNING id
  `;
  const purchaseResult = await pool.query(purchaseQueryText, [
    cashier_id,
    total_price,
  ]);
  const purchaseId = purchaseResult.rows[0].id;

  const purchasedProductQueryText = `
    INSERT INTO purchased_products (purchase_id, product_id)
    VALUES ($1, $2)
  `;
  for (const product of productDetails) {
    await pool.query(purchasedProductQueryText, [purchaseId, product.id]);
  }

  return {
    id: purchaseId,
    cashier_id,
    products: productDetails,
    total_price,
  };
};

export const deletesPurchase = async (purchase_id: number): Promise<void> => {
  const productIdsQueryText = ` SELECT product_id FROM purchased_products WHERE purchase_id = $1`;
  const productIdsResult = await pool.query(productIdsQueryText, [purchase_id]);
  const productsIds = productIdsResult.rows.map((row) => row.product_id);

  const updateProductsStatusQueryText = `UPDATE products SET status = 'available' WHERE id = ANY($1::int[])`;
  await pool.query(updateProductsStatusQueryText, [productsIds]);

  const deletePurchaseQueryText = `DELETE FROM purchases WHERE id = $1`;
  await pool.query(deletePurchaseQueryText, [purchase_id]);
};

export const getsAllPurchases = async (): Promise<IPurchase[]> => {
  const queryText = `SELECT * FROM purchases`;
  const { rows } = await pool.query(queryText);
  return rows;
};

export const getsPurchasesProfit = async (): Promise<number> => {
  const queryText = `SELECT SUM(total_price) AS total_profit FROM purchases`;
  const { rows } = await pool.query(queryText);

  const totalProfit = parseFloat(rows[0].total_profit);

  if (isNaN(totalProfit) || totalProfit === 0) {
    throw new Error("No profit from purchases or no purchases made.");
  }

  return parseFloat(totalProfit.toFixed(2));
};

export const getsPurchaseById = async (id: number): Promise<IPurchase> => {
  const queryText = `
    SELECT 
      purchases.id, 
      purchases.cashier_id, 
      purchases.total_price, 
      json_agg(
        json_build_object(
          'id', products.id,
          'name', products.name,
          'expiration_date',products.expiration_date,
          'price', products.unit_selling_price,
          'status', products.status,
          'batch_id', products.batch_id
        )
      ) AS products
    FROM 
      purchases
    LEFT JOIN 
      purchased_products ON purchases.id = purchased_products.purchase_id
    LEFT JOIN 
      products ON purchased_products.product_id = products.id
    WHERE 
      purchases.id = $1
    GROUP BY 
      purchases.id
  `;
  const { rows } = await pool.query(queryText, [id]);
  return rows[0];
};

export const updatesPurchaseCashier = async (
  id: number,
  cashier_id: number
): Promise<IPurchase> => {
  const queryText = `UPDATE purchases SET cashier_id = $1 WHERE id = $2 RETURNING *`;
  const { rows } = await pool.query(queryText, [cashier_id, id]);
  return rows[0];
};

export const updatesPurchaseProducts = async (
  id: number,
  products: number[]
): Promise<IPurchase> => {
  const productDetails: IProduct[] = [];
  let total_price = 0;

  const deletePurchasedProductsQueryText = `
    DELETE FROM purchased_products
    WHERE purchase_id = $1
  `;
  await pool.query(deletePurchasedProductsQueryText, [id]);

  for (const productId of products) {
    const product = await getsProductById(productId);
    if (product && product.status === "available") {
      productDetails.push(product);
      let price = product.unit_selling_price;
      if (typeof price === "string") {
        price = parseFloat(price);
      }
      total_price += price;

      product.status = "sold";
      await updatesProductStatus(productId, "sold");
    } else {
      throw new Error(`Product with ID ${productId} isn't available for sale.`);
    }
  }

  const purchaseQueryText = `
    UPDATE purchases SET total_price=$1
    WHERE id=$2
    RETURNING cashier_id
  `;
  const purchaseResult = await pool.query(purchaseQueryText, [total_price, id]);
  const cashier_id = purchaseResult.rows[0].cashier_id;

  const purchasedProductQueryText = `
    INSERT INTO purchased_products (purchase_id, product_id)
    VALUES ($1, $2)
  `;
  for (const product of productDetails) {
    await pool.query(purchasedProductQueryText, [id, product.id]);
  }

  return {
    id,
    cashier_id,
    products: productDetails,
    total_price,
  };
};
