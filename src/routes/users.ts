import express from "express";
import {
  createUser,
  userLogin,
  createAdmin,
  createManager,
  createStocker,
  createCashier,
  updateUser,
  updateManager,
  updateStocker,
  updateCashier,
  deleteUser,
  deleteManager,
  deleteStocker,
  deleteCashier,
  updatePassword,
  updateRole,
  updateEmail,
  getAllWorkers,
  getAllAdmins,
  getAllManagers,
  getAllStockers,
  getAllCashiers,
  getWorkerById,
  getAdminById,
  getManagerById,
  getStockerById,
  getCashierById,
  getWorkerByName,
  getManagerByName,
  getStockerByName,
  getCashierByName,
  getAdminByName,
} from "../controller/users";
import { authMiddleware, verifyRoles } from "../middleware/authentication";

const router = express.Router();

router.post("/user/register", authMiddleware, verifyRoles("admin"), createUser);

router.post("/user/login", userLogin);

//register:

router.post("/user/register/admin", createAdmin);

router.post(
  "/user/register/manager",
  authMiddleware,
  verifyRoles("admin"),
  createManager
);

router.post(
  "/user/register/stocker",
  authMiddleware,
  verifyRoles("admin", "manager"),
  createStocker
);

router.post(
  "/user/register/cashier",
  authMiddleware,
  verifyRoles("admin", "manager"),
  createCashier
);

//update:

router.patch(
  "/user/update/:id",
  authMiddleware,
  verifyRoles("admin"),
  updateUser
);

router.patch(
  "/user/update/manager/:id",
  authMiddleware,
  verifyRoles("admin"),
  updateManager
);

router.patch(
  "/user/update/stocker/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  updateStocker
);

router.patch(
  "/user/update/cashier/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  updateCashier
);

//update password, role, email:

router.patch("/user/update/password/:id", authMiddleware, updatePassword);

router.patch(
  "/user/update/role/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  updateRole
);

router.patch("/user/update/email/:id", authMiddleware, updateEmail);

//delete:

router.delete(
  "/user/delete/:id",
  authMiddleware,
  verifyRoles("admin"),
  deleteUser
);

router.delete(
  "/user/delete/manager/:id",
  authMiddleware,
  verifyRoles("admin"),
  deleteManager
);

router.delete(
  "/user/delete/stocker/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  deleteStocker
);

router.delete(
  "/user/delete/cashier/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  deleteCashier
);

//get all:

router.get("/user/all", authMiddleware, verifyRoles("admin"), getAllWorkers);

router.get(
  "/user/all/admin",
  authMiddleware,
  verifyRoles("admin"),
  getAllAdmins
);

router.get(
  "/user/all/manager",
  authMiddleware,
  verifyRoles("admin"),
  getAllManagers
);

router.get(
  "/user/all/stocker",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getAllStockers
);

router.get(
  "/user/all/cashier",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getAllCashiers
);

//get by id:

router.get("/user/:id", authMiddleware, verifyRoles("admin"), getWorkerById);

router.get(
  "/user/admin/:id",
  authMiddleware,
  verifyRoles("admin"),
  getAdminById
);

router.get(
  "/user/manager/:id",
  authMiddleware,
  verifyRoles("admin"),
  getManagerById
);

router.get(
  "/user/stocker/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getStockerById
);

router.get(
  "/user/cashier/:id",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getCashierById
);

//get by name:

router.get(
  "/user/:name",
  authMiddleware,
  verifyRoles("admin"),
  getWorkerByName
);

router.get(
  "user/admin/:name",
  authMiddleware,
  verifyRoles("admin"),
  getAdminByName
);

router.get(
  "user/manager/:name",
  authMiddleware,
  verifyRoles("admin"),
  getManagerByName
);

router.get(
  "user/stocker/:name",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getStockerByName
);

router.get(
  "user/cashier/:name",
  authMiddleware,
  verifyRoles("admin", "manager"),
  getCashierByName
);

export { router as userRoutes };
