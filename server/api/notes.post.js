// /api/note.post.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const token = getCookie(event, "NoteNestJWT");

    if (!token) {
      return createError({
        statusCode: 401,
        statusMessage: "Not authorized to access notes",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const note = await prisma.note.create({
      data: {
        text: body.text,
        userId: decoded.id,
      },
    });
    return note;
  } catch (error) {
    console.log(error.message);
    // Re-throw validation errors and other errors
    throw error;
  }
});
