import { apiGet } from "../api/apiUtils";

export type TransactionType = "credit" | "debit" | undefined;

interface TransactionListParams {
  offset?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  type?: TransactionType;
}

export const getWalletsTransactions = async ({
  offset = 0,
  limit = 20,
  fromDate,
  toDate,
  type,
}: TransactionListParams) => {
  let queryParams = `?offset=${offset}&limit=${limit}`;
  if (fromDate) queryParams += `&fromDate=${fromDate}`;
  if (toDate) queryParams += `&toDate=${toDate}`;
  if (type) queryParams += `&type=${type}`;

  return await apiGet<{ items: any[] }>(
    `/users/me/wallet-transactions${queryParams}`
  );
};
