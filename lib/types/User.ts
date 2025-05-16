export interface User {
  id: string
  mobile: string
  email: string
  firstname: string
  lastname: string
  nickname: string
  isRegistered: boolean
  state: {
    id: string
    name: string
  }
  country: {
    id: string
    name: string
    iso: string
    phoneCode: number
  }
  balance: number
  avatarUrl: string | null
  team: any
  pendingPrivateBets: number
  pendingPublicBets: number
  openBets: number
  completedBets: number
  opponentsCount: number
  isTransactionPinSet: boolean | null
  isDefaultPassword: boolean
}

export interface RegisteredUser {
  mobile: string
  role: string
  token: string
}
