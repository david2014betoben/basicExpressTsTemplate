import { Router } from "express";
import {
  getCustomer,
  getCustomerId,
  createCustomer,
  updateCustomer,
} from "../controllers/customer.controller.js";
import { validateCustomer } from "../middlewares/validate-customer.js";

const router: Router = Router(); //modificado por trabajar en pnpm

router.get("/customers", getCustomer);
router.get("/customers/:id", getCustomerId);
router.post("/customers", validateCustomer, createCustomer);
router.put("/customers/:id", validateCustomer, updateCustomer);

export default router;
