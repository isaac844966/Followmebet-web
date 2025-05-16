import { apiGet } from "../api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

export type FixtureGameType = "SOCCER" | "SPECIAL";

export interface FixtureParams {
  category_id?: string;
  type?: FixtureGameType;
  date_from?: string;
  date_to?: string;
  min_bets_count?: number;
  offset?: number;
  limit?: number;
}

export interface FixtureItemTeam {
  id: string | null;
  name: string;
  logoUrl: string;
  liveResult?: string | null;
}
interface BetStatus {
  status: "ON" | "OFF";
}
export interface FixtureItem {
  id: string;
  eventCode: string;
  totalBets: number;
  time: string;
  minutesPlayed?: string | null;
  htResult?: string | null;
  ftResult?: string | null;
  status?: string | null;
  date?: string | null;
  item1: FixtureItemTeam;
  item2: FixtureItemTeam;
  timer?: string | null;
  matchDate?: string | null;
  commentaryAvailable?: string | null;
  fixId?: string | null;
  matchId?: string | null;
  groupId?: string | null;
  betStatus?: BetStatus | "ON" | "OFF";
  matchDisplay?: string | null;
  eventType?: string | null;
  htWinner?: string | null;
  ftWinner?: string | null;
  category?: string | null;
  htScore?: string | null;
  ftScore?: string | null;
  payout?: string | null;
  resultStatus?: string | null;
  htPayout?: string | null;
}

export interface FixtureCategory {
  id: string;
  category: string;
  items: FixtureItem[];
}

export interface FixtureResponse {
  offset: number;
  limit: number;
  count: number;
  total: number;
  items: FixtureCategory[];
}

export async function getFixtures(
  params: FixtureParams = {}
): Promise<FixtureResponse> {
  try {
    const qs = new URLSearchParams();
    if (params.category_id) qs.append("category_id", params.category_id);
    if (params.type) qs.append("type", params.type);
    if (params.date_from) qs.append("date_from", params.date_from);
    if (params.date_to) qs.append("date_to", params.date_to);
    if (params.min_bets_count != null)
      qs.append("min_bets_count", params.min_bets_count.toString());
    if (params.offset != null) qs.append("offset", params.offset.toString());
    if (params.limit != null) qs.append("limit", params.limit.toString());

    const url = `/fixtures?${qs.toString()}`;
    const response = await apiGet<FixtureResponse>(url);

    return response.data;
  } catch (err) {
    throw formatApiError(err, "Failed to fetch fixtures");
  }
}
