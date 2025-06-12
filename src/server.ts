import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.post("/users", async (request: Request, response: Response) => {
  const { name, cpf, email } = request.body;

  try {
    const resultado = await prisma.user.create({
      data: {
        cpf,
        email,
        name,
      },
      select: {
        cpf: true,
        name: true,
      },
    });
    response.status(201).json(resultado);
  } catch (error: any) {
    if (error.code === "P2002") {
      // Erro de chave única (ex: CPF duplicado)
      response.status(409).json({ error: "CPF ou email já cadastrado." });
      return;
    }
    response.status(500).json({ error: "Erro interno do servidor." });
  }
});
app.get("/users", async (request: Request, response: Response) => {
  try {
    const resultado = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });
    response.status(200).json(resultado);
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ error: "Erro interno do servidor." });
  }
});
app.put("/users/:id", async (request: Request, response: Response) => {
  const { name, cpf, email } = request.body;
  const { id } = request.params;

  try {
    const resultado = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        cpf,
        name,
      },
    });
    response.status(200).json(resultado);
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ error: "Erro interno do servidor." });
  }
});
app.delete("/users/:id", async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const resultado = await prisma.user.delete({
      where: {
        id,
      },
    });
    response.status(200).json(resultado);
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(3000, () => {
  console.log("server online on port 3000");
});
