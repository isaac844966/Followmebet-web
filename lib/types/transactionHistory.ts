export interface User {
  id: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  avatarUrl: string;
}

export interface Team {
  name: string;
  logoUrl: string;
}

export interface Fixture {
  id: string;
  time: string;
  item1: Team;
  item2: Team;
  htResult?: string;
  ftResult?: string;
}

export interface BetItem {
  id: string;
  time: string;
  owner: User;
  challenger: User | null;
  fixture: Fixture;
  category: string;
  ownerPrediction: string;
  challengerPrediction: string | null;
  condition: string;
  totalAmount: number;
  potentialWin: number;
  fee: number;
  status: string;
  result: string;
  type: string;
}
