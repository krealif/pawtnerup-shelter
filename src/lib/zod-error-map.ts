import * as z from 'zod';

const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  /*
  This is where you override the various error codes
  */
  switch (error.code) {
    case z.ZodIssueCode.invalid_string:
      if (error.validation === 'email') {
        return { message: `Must be a valid email address` };
      }
      break;
    case z.ZodIssueCode.too_small:
      if (error.type === 'string') {
        return { message: `Must be at least ${error.minimum} character(s)` };
      }
      break;
    case z.ZodIssueCode.too_big:
      if (error.type === 'string') {
        return {
          message: `May not be greater than ${error.maximum} character(s)`,
        };
      }
      break;
    case z.ZodIssueCode.invalid_enum_value:
      return {
        message: `Must select ${error.path} values`,
      };
  }
  // fall back to default message!
  return { message: ctx.defaultError };
};

export default customErrorMap;
