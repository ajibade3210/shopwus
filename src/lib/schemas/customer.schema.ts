import { z } from "zod";

export const ServiceStatusSchema = z.enum(["active", "completed", "pending", "cancelled"]);

export const CustomerServiceSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().optional(),
  customerId: z.string().min(1),
  name: z.string().min(1, "Service name is required").trim(),
  service: z.string().min(1, "Service category/scope is required").trim(),
  amount: z.number().nonnegative(),
  status: ServiceStatusSchema,
  createdAt: z.string().min(1),
  completedAt: z.string().optional(),
});

export const AddServiceInputSchema = z.object({
  businessId: z.string().optional(),
  name: z.string().min(1, "Service name is required").trim(),
  service: z.string().min(1, "Service is required").trim(),
  amount: z.number().nonnegative("Amount must be a positive number"),
  status: ServiceStatusSchema.optional(),
});

export const CustomerAttributeSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Attribute key is required")
    .max(50, "Attribute key must not exceed 50 characters")
    .regex(/^[^|]+$/, "Pipe (|) character is not allowed in attribute key"),
  value: z
    .string()
    .trim()
    .min(1, "Attribute value is required")
    .max(100, "Attribute value must not exceed 100 characters")
    .regex(/^[^|]+$/, "Pipe (|) character is not allowed in attribute value"),
});

export const RawCustomerAttributeSchema = z.object({
  key: z.string().default(""),
  value: z.string().default(""),
});

export const CustomerAttributesArraySchema = z
  .array(RawCustomerAttributeSchema)
  .transform(items => items.filter(item => item.key.trim() !== "" || item.value.trim() !== ""))
  .pipe(
    z
      .array(CustomerAttributeSchema)
      .max(25, "Maximum 25 attributes allowed per customer")
      .superRefine((items, ctx) => {
        const seenKeys = new Set<string>();
        for (let i = 0; i < items.length; i++) {
          const lowerKey = items[i].key.toLowerCase().trim();
          if (seenKeys.has(lowerKey)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Duplicate attribute key "${items[i].key}"`,
              path: [i, "key"],
            });
          }
          seenKeys.add(lowerKey);
        }
      })
  );

export const NewCustomerInputSchema = z
  .object({
    businessId: z.string().optional(),
    name: z.string().min(1, "Customer name is required").trim(),
    email: z
      .string()
      .trim()
      .optional()
      .refine(val => !val || z.string().email().safeParse(val).success, {
        message: "Invalid email address",
      }),
    phone: z.string().optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
    attributes: CustomerAttributesArraySchema.optional().nullable(),
    serviceName: z.string().optional(),
    service: z.string().optional(),
    amount: z.number().nonnegative().optional(),
    status: ServiceStatusSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine(data => Boolean(data.email?.trim() || data.phone?.trim()), {
    message: "At least one contact method (email or phone) is required",
    path: ["email"],
  });

export const CustomerSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().optional(),
  name: z.string().min(1).trim(),
  email: z.string().trim().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  services: z.array(CustomerServiceSchema),
  totalRevenue: z.number().nonnegative(),
  notes: z.string().optional(),
  attributes: z.array(CustomerAttributeSchema).optional().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
});

export type NewCustomerInput = z.infer<typeof NewCustomerInputSchema>;
export type AddServiceInput = z.infer<typeof AddServiceInputSchema>;
export type CustomerValidation = z.infer<typeof CustomerSchema>;
