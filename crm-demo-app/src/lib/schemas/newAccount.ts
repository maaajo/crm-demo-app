import * as z from "zod";
import { AccountStatus, Sources, Currencies } from "../types/account";

export const newAccountSchema = z.object({
  name: z.string().min(2, { message: "Account Name has to be filled" }),
  is_active: z.boolean({
    required_error: "Active is required",
  }),
  status: z.nativeEnum(AccountStatus, {
    required_error: "Status has to be filled",
  }),
  source: z.enum(Sources),
  currency: z.enum(Currencies),
  country: z.string().min(2, { message: "City has to be selected" }),
  city: z.string().min(3, { message: "City has to be filled" }),
  website: z.string().url().optional().or(z.literal("")),
  revenue: z.union([z.number(), z.nan()]).optional(),
  address_line: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});
