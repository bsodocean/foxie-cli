import { Goodie } from "@prisma/client";
import { Request, Response, Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import prisma from "../prisma/prismaClientSingleton";

const router = Router();

router.get("/api/getGoodies", (req: Request, res: Response) => {
  asyncHandler(async (req, res) => {
    const goodies = await prisma.goodie.findMany();
    res.status(200).json(goodies);
  });

  router.post("/api/createGoodie", (req: Request, res: Response) => {
    asyncHandler(async (req, res) => {
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
    });
  });

  router.patch(
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

  router.get(
    "/api/getPriceHistory/:id",
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
    })
  );
});
