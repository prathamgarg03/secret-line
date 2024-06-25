import { z } from 'zod';

export const signInSchema = z.object({
    acceptMesasges: z.boolean(),
})