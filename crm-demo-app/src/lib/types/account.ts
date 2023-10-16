import { newAccountSchema } from "../schemas/newAccount";
import { Database } from "./supabase";
import * as z from "zod";

export const AccountStatus = {
  NEW: "new",
  PENDING: "pending",
  CLOSED: "closed",
} as const;

export const Currencies = ["USD", "EUR", "GBP", "Other"] as const;
export const Sources = [
  "Company Website",
  "LinkedIn",
  "Referral",
  "Other",
] as const;

export type TAccountZOD = z.infer<typeof newAccountSchema>;

export type TAccountSupabase = Database["public"]["Tables"]["accounts"]["Row"];

export const AccountAction = {
  ADD: "add",
  UPDATE: "update",
  DELETE: "delete",
} as const;

export type TAccountAction = (typeof AccountAction)[keyof typeof AccountAction];
