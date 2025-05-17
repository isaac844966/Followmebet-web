import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BankState {
  bankAccounts: any[];
  addBankAccount: (bank: any) => void;
  deleteBankAccount: (id: string) => void;
  setBankAccounts: (accounts: any[]) => void;
}

export const useBankStore = create<BankState>()(
  persist(
    (set) => ({
      bankAccounts: [],
      addBankAccount: (bank) =>
        set((state) => ({
          bankAccounts: [...state.bankAccounts, bank],
        })),
      deleteBankAccount: (id) =>
        set((state) => ({
          bankAccounts: state.bankAccounts.filter(
            (account) => account.id !== id
          ),
        })),
      setBankAccounts: (accounts) => set({ bankAccounts: accounts }),
    }),
    {
      name: "bank-storage", // Storage name
    }
  )
);
