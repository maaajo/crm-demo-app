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

type TAccountSupabaseAll = Database["public"]["Tables"]["account"]["Row"];

export type TAccountSupabase = Omit<
  TAccountSupabaseAll,
  "created_by" | "edited_by"
>;

export type TAccountSupabaseInsert = Omit<
  Database["public"]["Tables"]["account"]["Insert"],
  "created_by" | "edited_by"
>;

export const AccountAction = {
  ADD: "add",
  UPDATE: "update",
  DELETE: "delete",
} as const;

export type TAccountAction = (typeof AccountAction)[keyof typeof AccountAction];
export type TCurrency = (typeof Currencies)[number];
export type TSource = (typeof Sources)[number];
export type TAccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];
