// /api/notes
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "NoteNestJWT");

    if (!token) {
      return createError({
        statusCode: 401,
        statusMessage: "Not authorized to access notes",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded", decoded);
    const notes = await prisma.note.findMany({
      where: {
        userId: decoded.id,
      },
    });
    return notes;
  } catch (error) {
    console.error(error);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
