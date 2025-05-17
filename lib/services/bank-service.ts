import { apiGet, apiPost, apiDelete } from "../../lib/api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

interface BankAccountParams {
  bankId: string;
  accountNumber: string;
}

export const addBankAccount = async ({
  bankId,
  accountNumber,
}: BankAccountParams) => {
  try {
    return await apiPost<{ id: string }>("/users/me/accounts", {
      bankId,
      accountNumber,
    });
  } catch (error) {
    throw formatApiError(error, "Failed to add bank account");
  }
};

export const getBankAccounts = async () => {
  try {
    return await apiGet<{ items: any[] }>("/users/me/accounts");
  } catch (error) {
    throw formatApiError(error, "Failed to get bank accounts");
  }
};

export const fetchBanks = async () => {
  try {
    return await apiGet<{ items: any[] }>(
      "/countries/1c58d7f9-e93b-11eb-a1e0-060c4acaff96/banks"
    );
  } catch (error) {
    throw formatApiError(error, "Failed to fetch banks");
  }
};

export const deleteBankAccount = async (accountId: string) => {
  try {
    return await apiDelete(`/users/me/accounts/${accountId}`);
  } catch (error) {
    throw formatApiError(error, "Failed to delete bank account");
  }
};
