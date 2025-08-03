// /api/user.post.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    const isValid = await bcrypt.compare(body.password, user.password);
    console.log("isValid", isValid);

    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: "Username or password is incorrect",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    setCookie(event, "NoteNestJWT", token);

    return { data: "User logged in successfully" };
  } catch (error) {
    console.log(error.message);
    if (error.code === "P2002") {
      throw createError({
        statusCode: 409,
        message: "Email already exists",
      });
    }
    // Re-throw validation errors and other errors
    throw error;
  }
});
