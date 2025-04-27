import { z } from "zod";

export const centerSchema = z.object({
  name: z.string().min(1, "Center name is required"),
  regionId: z.number().min(1, "Region is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  majorIds: z.array(z.number()).min(1, "Please select at least one major"),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || file instanceof File,
      "Image must be a file"
    ),
});
