import { apiGet, apiPost } from "../api/apiUtils";
import { Fixture } from "../types/transactionHistory";
import { User } from "../types/User";
import { formatApiError } from "../utils/errorUtils";

export type BetGameType = "SOCCER" | "SPECIAL";
export type BetPrediction = "WIN" | "LOSE" | "DRAW";
export type BetCondition = "HT" | "FT";

export interface CreateBetMarketPayload {
  fixtureId: string;
  prediction: BetPrediction;
  condition: BetCondition;
  amount: number;
  invitedId?: string;
  inviteeName?: string;
  mobile?: string;
  message?: string;
}

export interface CreateBetMarketResponse {
  id: string;
  category: string;
  challenger: User;
  challengerPrediction: string | null;
  condition: string;
  fee: number;
  fixture: Fixture;
  owner: User;
  ownerPrediction: string;
  potentialWin: number;
  result: string;
  status: string;
  time: string;
  totalAmount: number;
}

export interface BetMarketParams {
  fixture_id?: string;
  category_id?: string;
  type?: BetGameType;
  date_from?: string;
  date_to?: string;
  prediction?: BetPrediction;
  condition?: BetCondition;
  offset?: number;
  limit?: number;
  amount?: number;
}

export interface BetMarketUser {
  id: string;
  firstname: string;
  lastname: string;
  nickname: string;
  avatarUrl: string;
  isRegistered: boolean;
}

export interface BetMarketTeam {
  id: string | null;
  name: string;
  logoUrl: string;
  liveResult?: string | null;
}

export interface BetMarketFixture {
  id: string;
  eventCode?: string | null;
  totalBets?: number | null;
  time?: string | null;
  minutesPlayed?: string | null;
  htResult?: string | null;
  ftResult?: string | null;
  status?: string | null;
  date?: string | null;
  item1: BetMarketTeam;
  item2: BetMarketTeam;
  timer?: string | null;
  matchDate?: string | null;
  commentaryAvailable?: boolean | null;
  fixId?: string | null;
  matchId?: string | null;
  groupId?: string | null;
  betStatus?: string | null;
  matchDisplay?: string | null;
  eventType?: string | null;
  htWinner?: string | null;
  ftWinner?: string | null;
  category?: string | null;
  htScore?: string | null;
  ftScore?: string | null;
  payout?: number | null;
  resultStatus?: string | null;
  htPayout?: number | null;
}

export interface BetMarketItem {
  id: string;
  category: string;
  owner: BetMarketUser;
  ownerPrediction: BetPrediction;
  condition: BetCondition;
  challenger: BetMarketUser | null;
  challengerPrediction: BetPrediction | null;
  fee: number;
  totalAmount: number;
  potentialWin: number;
  time: string;
  status: string;
  result: BetPrediction;
  fixture: BetMarketFixture;
}

export interface BetMarketCategory {
  id: string;
  category: string;
  items: BetMarketItem[];
}

export interface BetMarketResponse {
  offset: number;
  limit: number;
  count: number;
  total: number;
  items: BetMarketCategory[];
}

export async function getBetMarkets(
  params: BetMarketParams = {}
): Promise<BetMarketResponse> {
  try {
    const qs = new URLSearchParams();
    if (params.fixture_id) qs.append("fixture_id", params.fixture_id);
    if (params.category_id) qs.append("category_id", params.category_id);
    if (params.type) qs.append("type", params.type);
    if (params.date_from) qs.append("date_from", params.date_from);
    if (params.date_to) qs.append("date_to", params.date_to);
    if (params.prediction) qs.append("prediction", params.prediction);
    if (params.condition) qs.append("condition", params.condition);
    if (params.offset != null) qs.append("offset", params.offset.toString());
    if (params.limit != null) qs.append("limit", params.limit.toString());
    if (params.amount != null) qs.append("amount", params.amount.toString());

    const url = `/bet-markets?${qs.toString()}`;
    const response = await apiGet<BetMarketResponse>(url);
    return response.data;
  } catch (err) {
    throw formatApiError(err, "Failed to fetch bet markets");
  }
}

export async function getFixtureById(
  fixtureId: string
): Promise<BetMarketFixture> {
  try {
    const url = `/fixtures/${fixtureId}`;
    const response = await apiGet<BetMarketFixture>(url);
    return response.data;
  } catch (err) {
    throw formatApiError(err, "Failed to fetch fixture details");
  }
}

export async function createBetMarket(
  payload: CreateBetMarketPayload
): Promise<CreateBetMarketResponse> {
  try {
    const response = await apiPost<CreateBetMarketResponse>(
      "/bet-markets",
      payload
    );
    return response.data;
  } catch (err) {
    throw formatApiError(err, "Failed to create bet challenge");
  }
}

export interface SuggestedChallenger extends BetMarketUser {}

export interface SuggestedChallengerResponse {
  offset: number;
  limit: number;
  count: number;
  total: number;
  items: SuggestedChallenger[];
}

export async function getSuggestedChallengers(
  offset = 0,
  limit = 20
): Promise<SuggestedChallengerResponse> {
  try {
    const url = `/users/me/challengers?offset=${offset}&limit=${limit}`;
    const response = await apiGet<SuggestedChallengerResponse>(url);
    return response.data;
  } catch (err) {
    throw formatApiError(err, "Failed to fetch suggested challengers");
  }
}
