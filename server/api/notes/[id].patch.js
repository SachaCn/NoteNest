// /api/note.post.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const token = getCookie(event, "NoteNestJWT");
    const id = event.context.params.id;
    if (!token) {
      return createError({
        statusCode: 401,
        statusMessage: "Not authorized to access notes",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const targetNote = await prisma.note.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!targetNote) {
      return createError({
        statusCode: 401,
        statusMessage: "Note does not exist",
      });
    }

    if (targetNote.userId !== decoded.id) {
      return createError({
        statusCode: 401,
        statusMessage: "Does not have permission to edit this note",
      });
    }

    const note = await prisma.note.update({
      where: {
        id: Number(id),
      },
      data: {
        text: body.text,
      },
    });
    return note;
  } catch (error) {
    console.log(error.message);
    // Re-throw validation errors and other errors
    throw error;
  }
});
