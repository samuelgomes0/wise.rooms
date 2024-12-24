import { z } from "zod";

const createResourceSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  quantity: z
    .number({ invalid_type_error: "Informe a quantidade como um número." })
    .min(1, { message: "A quantidade deve ser pelo menos 1." }),
  roomId: z.string().min(1, {
    message: "Selecione uma sala para alocar o recurso.",
  }),
  description: z.string().optional(),
});

export default createResourceSchema;
