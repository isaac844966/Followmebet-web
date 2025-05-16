import { apiPut } from "../api/apiUtils"
import { formatApiError } from "../utils/errorUtils"

interface ProfileUpdateData {
  email: string
  firstname: string
  lastname: string
  nickname: string
  countryId: string
  stateId: string
}

export const editProfile = async (data: ProfileUpdateData) => {
  try {
    return await apiPut("/users/me", data)
  } catch (error) {
    throw formatApiError(error, "Failed to update profile")
  }
}
