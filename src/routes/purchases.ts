import { Router } from "express";
import {
  createPurchase,
  deletePurchase,
  getAllPurchases,
  getPurchasesProfit,
  getPurchaseById,
} from "../controller/purchases";
import { authMiddleware, verifyRoles } from "../middleware/authentication";

const router = Router();

//create purchase:
router.post(
  "/purchase/create",
  authMiddleware,
  verifyRoles("admin", "cashier"),
  createPurchase
);

//delete purchase:
router.delete(
  "/purchase/delete/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  deletePurchase
);

//get all purchases:
router.get(
  "/purchase/all",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getAllPurchases
);

//get total profit of all purchases:
router.get(
  "/purchase/profit",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getPurchasesProfit
);

//get purchase by id:
router.get(
  "/purchase/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getPurchaseById
);

export { router as purchaseRoutes };
