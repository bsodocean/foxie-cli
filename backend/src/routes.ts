import { Goodie } from "@prisma/client";
import { Request, Response, Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import prisma from "../prisma/prismaClientSingleton";

const router = Router();

const sendResponse = (
  res: Response,
  status: "success" | "error",
  data: any[],
  message: string = "",
  code: number = 200
): void => {
  res.status(code).json({
    status,
    message,
    data,
  });
};

router.get(
  "/api/getGoodies",
  asyncHandler(async (req: Request, res: Response) => {
    const goodies = await prisma.goodie.findMany();
    sendResponse(res, "success", goodies, "Goodies fetched successfully", 200);
  })
);

router.post(
  "/api/createGoodie",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, name, price, amount, createdAt } = req.body;

    const newGoodie: Goodie = await prisma.goodie.create({
      data: {
        id,
        name,
        price,
        amount,
        createdAt,
      },
    });
    res.status(201).json(newGoodie);
  })
);

router.patch(
  "/api/updateGoodie/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const oldGoodie = await prisma.goodie.findUnique({ where: { id: id } });

    const updatedGoodie = await prisma.goodie.update({
      where: { id },
      data: updates,
    });

    if (!oldGoodie) {
      res.status(400).json({ Error: "Nope" });
    } else {
      await prisma.auditLog.create({
        data: {
          goodieId: id,
          oldName: oldGoodie.name,
          oldPrice: oldGoodie.price,
          oldAmount: oldGoodie.amount,
          timestamp: new Date(),
        },
      });
    }
    res.status(200).json(updatedGoodie);
  })
);

router.delete(
  "/api/deleteGoodie/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const goodieToDelete = await prisma.goodie.findUnique({
      where: { id: id },
    });
    !goodieToDelete
      ? res.status(400).json({ Error: "No matching goodie found" })
      : await prisma.goodie.delete({
          where: { id },
        });

    res.status(200).send();
  })
);

router.get(
  "/api/getPriceHistory/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const goodie = await prisma.auditLog.findMany({
      where: { goodieId: id },
    });

    let priceHistory: { editId: number; oldPrice: number; timestamp: Date }[] =
      [];

    !goodie
      ? res.status(400).json({ Error: "No goodie found" })
      : (priceHistory = await prisma.auditLog.findMany({
          where: { goodieId: id },
          select: { editId: true, oldPrice: true, timestamp: true },
        }));
    console.log(priceHistory);
    res.status(200).json(priceHistory);
  })
);

router.get(
  "/api/lookupGoodie/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const goodie = await prisma.goodie.findUnique({ where: { id: id } });
    !goodie
      ? res.status(400).json({ Error: "No goodie found:(" })
      : res.status(200).json(goodie);
  })
);

router.get(
  "/api/filterByQuantity",
  asyncHandler(async (req: Request, res: Response) => {
    const goodies = await prisma.goodie.findMany();
    goodies.sort((a, b) => b.amount - a.amount);
    res.status(200).json(goodies);
  })
);

export default router;
