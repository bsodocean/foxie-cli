import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import errorHandler from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import { ApiError } from "../errors";

dotenv.config();

const app = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

interface Goodie {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
}

// Enable JSON body parsing
app.use(express.json());

app.get(
  "/api/getGoodies",
  asyncHandler(async (req, res) => {
    const goodies = await prisma.goodie.findMany();
    res.status(200).json(goodies);
  })
);

app.post(
  "/api/createGoodie",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, name, price, createdAt } = req.body;

    const newGoodie: Goodie = await prisma.goodie.create({
      data: {
        id,
        name,
        price,
        createdAt,
      },
    });
    res.status(201).json(newGoodie);
  })
);

app.patch(
  "/api/updateGoodie/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const updatedGoodie = await prisma.goodie.update({
      where: { id },
      data: updates,
    });

    res.status(200).json(updatedGoodie);
  })
);

app.get(
  "/getError",
  asyncHandler(async (req: Request, res: Response) => {
    throw new ApiError("Error Skibidi");
  })
);

app.get(
  "/api/hello",
  asyncHandler(async (req: Request, res: Response) => {
    const sayHello =
      "Hello, your server is running at " + `http://localhost:${port}`;
    res.status(200).json(sayHello);
  })
);

app.use(errorHandler as express.ErrorRequestHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
