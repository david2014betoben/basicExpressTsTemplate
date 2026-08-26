import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router: Router = Router(); //modificado por trabajar en pnpm

router.get("/menu", getMenu);
router.get("/menu/:id", getProduct);
router.post("/menu", createProduct);
router.put("/menu/:id", updateProduct);

export default router;
