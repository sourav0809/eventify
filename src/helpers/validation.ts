import { z } from "zod";

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
};

export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  try {
    const validData = schema.parse(data);
    return {
      success: true,
      data: validData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error?.errors?.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
      return {
        success: false,
        errors,
      };
    }
    return {
      success: false,
      errors: {
        _form: "An unexpected error occurred",
      },
    };
  }
};
