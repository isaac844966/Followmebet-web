import { apiDelete, apiGet, apiPost, apiPut } from "../api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

export type BetType = "PUBLIC" | "PRIVATE" | undefined;
export type BetResult =
  | "WIN"
  | "LOSE"
  | "DRAW"
  | "INPROGRESS"
  | "CANCELED"
  | undefined;
export type BetStatus =
  | "PENDING"
  | "ACTIVE"
  | "CANCELED"
  | "COMPLETED"
  | undefined;
export type BetGameType = "SOCCER" | "SPECIAL" | undefined;

interface BetHistoryParams {
  offset?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
  type?: BetGameType;
  status?: BetStatus;
  result?: BetResult;
  bet_type?: BetType;
}
interface AcceptParams {
  betMarketId: string;
  prediction: string;
}
export const getBetTransactions = async ({
  offset = 0,
  limit = 20,
  date_from,
  date_to,
  type,
  status,
  result,
  bet_type,
}: BetHistoryParams) => {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });

  if (date_from) params.append("date_from", date_from);
  if (date_to) params.append("date_to", date_to);
  if (type) params.append("type", type);
  if (status) params.append("status", status);
  if (result) params.append("result", result);
  if (bet_type) params.append("bet_type", bet_type);

  return await apiGet<{ items: any[] }>(
    `/users/me/bet-transactions?${params.toString()}`
  );
};

export const getBetById = async (betMarketId: string) => {
  try {
    return await apiGet(`/bet-markets/${betMarketId}`);
  } catch (error) {
    throw formatApiError(error, "Failed to delete bet");
  }
};

export const deleteBet = async (betMarketId: string) => {
  try {
    return await apiDelete(`/bet-markets/${betMarketId}`);
  } catch (error) {
    throw formatApiError(error, "Failed to delete bet");
  }
};

export const acceptBet = async ({ betMarketId, prediction }: AcceptParams) => {
  try {
    return await apiPut<{ id: string }>(`/bet-markets/${betMarketId}`, {
      prediction,
    });
  } catch (error) {
    throw formatApiError(error, "Failed to accept bet");
  }
};

export const declineBet = async (betMarketId: string) => {
  try {
    return await apiDelete(`/bet-markets/${betMarketId}`);
  } catch (error) {
    throw formatApiError(error, "Failed to delete bet");
  }
};
