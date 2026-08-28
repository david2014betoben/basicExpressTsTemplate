import express, { type Request, type Response } from "express";
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import productosRouter from "./routes/product.routes.js";
import customersRouter from "./routes/customer.routes.js";

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/docs", swaggerRouter);

app.get("/", (req: Request, res: Response) => {
  /*#swagger.tags = ['Tests']*/
  res.json({
    status: "Server online",
    version: "1.0.0",
  });
});

app.use("/api", productosRouter);
app.use("/api", customersRouter);

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});
