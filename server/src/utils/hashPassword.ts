import argon2 from "argon2";
import { HASH_OPTIONS } from "../constants";
import AppError from "./errorHandling";

function validatePassword(password: string): void {
  if (typeof password !== "string" || password.trim().length === 0) {
    throw new AppError(
      "invalid_password",
      "A senha deve ser uma string não vazia.",
      400
    );
  }
}

async function hashPassword(password: string): Promise<string> {
  validatePassword(password);
  try {
    const hash = await argon2.hash(password, HASH_OPTIONS);
    return hash;
  } catch (error) {
    throw new AppError("hash_error", "Erro ao gerar hash da senha.", 500);
  }
}

export default hashPassword;
