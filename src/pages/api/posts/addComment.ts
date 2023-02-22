import type {
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(
      req,
      res,
      authOptions
    );
    if (!session)
      return res
        .status(401)
        .json({ message: "Please sign in." });

    //get user
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email },
    });

    try {
      const { title, postId } = req.body.data;

      if (!title.length) {
        return res.status(401).json({
          message: `Please enter something.`,
        });
      }

      const result = await prisma.comment.create({
        data: {
          userId: prismaUser?.id,
          message: title,
          postId,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({
        err: "Error has occured whilst making a post.",
      });
    }
  }
}
