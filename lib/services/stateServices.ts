import { apiGet } from "../api/apiUtils"
import { formatApiError } from "../utils/errorUtils"

export const fetchStates = async () => {
  try {
    return await apiGet<{ items: any[] }>("/countries/1c58d7f9-e93b-11eb-a1e0-060c4acaff96/states?limit=36")
  } catch (error) {
    throw formatApiError(error, "Failed to fetch states")
  }
}
