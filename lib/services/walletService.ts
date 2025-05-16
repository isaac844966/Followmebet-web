import { apiGet, apiPost } from "../api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

interface Withdrawal {
  amount: number;
  accountId: string;
  pin: string;
}
interface Deposit {
  amount: number;
}

export const DepositService = async ({ amount }: Deposit) => {
  try {
    return await apiPost("/transactions", {
      amount,
    });
  } catch (error) {
    throw formatApiError(error, "Failed to make deposit");
  }
};
export const Withdrawal = async ({ amount, accountId, pin }: Withdrawal) => {
  try {
    return await apiPost<{ id: string }>("/transactions/withdrawals", {
      amount,
      accountId,
      pin,
    });
  } catch (error) {
    throw formatApiError(error, "Failed to make withdrawal");
  }
};

interface TransactionQueryParams {
  date_from?: string;
  date_to?: string;
  offset?: number;
  limit?: number;
}

export const getTransaction = async (params: TransactionQueryParams = {}) => {
  try {
    const query = new URLSearchParams();

    if (params.date_from) query.append("date_from", params.date_from);
    if (params.date_to) query.append("date_to", params.date_to);
    if (typeof params.offset === "number")
      query.append("offset", params.offset.toString());
    if (typeof params.limit === "number")
      query.append("limit", params.limit.toString());

    const queryString = query.toString();
    const url = `/users/me/transactions${queryString ? `?${queryString}` : ""}`;

    return await apiGet<{ items: any[] }>(url);
  } catch (error) {
    throw formatApiError(error, "Failed to get transactions");
  }
};
