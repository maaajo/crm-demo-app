import * as z from "zod";
import { AccountStatus, Sources, Currencies } from "../types/account";

export const newAccountSchema = z.object({
  id: z.string().uuid(),
  accountName: z.string().min(2, { message: "Account Name has to be filled" }),
  isActive: z.boolean({
    required_error: "Active is required",
  }),
  status: z.nativeEnum(AccountStatus, {
    required_error: "Status has to be filled",
  }),
  source: z.enum(Sources),
  currency: z.enum(Currencies),
  website: z.string().url().optional().or(z.literal("")),
  revenue: z.union([z.number(), z.nan()]).optional(),
  addressLine: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});
