import { ReactNode, createContext, useContext, useReducer } from "react";
import {
  TAccountSupabase,
  TAccountAction,
  AccountAction,
} from "../types/account";

type TAccountProviderProps = {
  children: ReactNode;
};

type TAccountReducerAction = {
  type: TAccountAction;
  payload: TAccountSupabase;
};

type TAccountContext = {
  state: TAccountSupabase[];
  dispatch: (action: TAccountReducerAction) => void;
};

const AccountsContext = createContext<TAccountContext | undefined>(undefined);

const accountReducer = (
  state: TAccountSupabase[],
  action: TAccountReducerAction
) => {
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

function AccountsProvider({ children }: TAccountProviderProps) {
  const [state, dispatch] = useReducer(accountReducer, []);

  const value = { state, dispatch };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}

function useAccounts() {
  const context = useContext(AccountsContext);

  if (context === undefined) {
    throw new Error("useAccounts must be used within AccountsProvider");
  }

  return context;
}

export { AccountsProvider, useAccounts };
