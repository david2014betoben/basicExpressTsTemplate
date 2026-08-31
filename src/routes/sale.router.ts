import { Router } from "express";

import {
  getSale,
  getSaleId,
  createSale,
  updateSale,
} from "../controllers/sale.controller.js";

import { validateSale } from "../middlewares/validate-sale.js";

const router: Router = Router(); // modificado por trabajar en pnpm

router.get("/sales", getSale);

router.get("/sales/:id", getSaleId);

router.post("/sales", validateSale, createSale);

router.put("/sales/:id", validateSale, updateSale);

export default router;
