// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Please Sign in to make post." });

    const title: string = req.body.title;
    console.log(typeof title);

    //Get User
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    });

    //Check title
    if (title.length > 300) {
      return res.status(403).json({ message: "Please write a shorter post." });
    }
    if (title.length === 0) {
      return res.status(403).json({ message: `Please do not leave this empty.` });
    }
    try {
      const result = await prisma.post.create({
        data: {
          title,
          userId: prismaUser !== null ? prismaUser.id : "userId is null",
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(401);
    }
  }
}
