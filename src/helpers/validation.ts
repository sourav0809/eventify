import { z } from "zod";
import { toast } from "sonner";

export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; error?: string; data?: T } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    let firstErrorMessage = "";

    for (const err of result.error.issues) {
      const fieldName = err.path.join(".");
      fieldErrors[fieldName] = err.message;

      if (!firstErrorMessage) {
        firstErrorMessage = err.message;
      }
    }

    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
    }
    const error = result.error.issues[0]?.message || "Something went wrong.";

    return { success: false, error: error };
  }

  return { success: true, data: result.data };
}
