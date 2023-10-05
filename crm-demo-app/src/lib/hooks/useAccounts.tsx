import { TAccountSchema } from "@/pages/accounts/new";
import { useReducer } from "react";

const AccountAction = {
  ADD: "add",
  UPDATE: "update",
  DELETE: "delete",
} as const;

export type TAccountAction = (typeof AccountAction)[keyof typeof AccountAction];

type TAccountReducerAction = {
  type: TAccountAction;
  payload: TAccountSchema;
};

export default function useAccounts() {
  const reducer = (state: TAccountSchema[], action: TAccountReducerAction) => {
    switch (action.type) {
      case AccountAction.ADD:
        return [...state, action.payload];
      case AccountAction.UPDATE:
        return state.map((account) => {
          if (account.id === action.payload.id) {
            return action.payload;
          }
          return account;
        });
      case AccountAction.DELETE:
        return state.filter((account) => account.id !== action.payload.id);
      default:
        return state;
    }
  };

  const [accounts, dispatchAccounts] = useReducer(reducer, []);

  return {
    accounts,
    updateAccountsFn: dispatchAccounts,
  };
}
