// /api/user.post.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import validator from "validator";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!validator.isEmail(body.email)) {
      throw createError({
        statusCode: 400,
        message: "Invalid email",
      });
    }
    if (
      !validator.isStrongPassword(body.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw createError({
        statusCode: 400,
        message: "Password is not strong enough",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        salt: salt,
      },
    });
    return { data: "User created successfully" };
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
