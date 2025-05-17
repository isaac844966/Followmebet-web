import { apiPut } from "../../lib/api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

interface ChangePasswordParams {
  current_password: string;
  password: string;
}

export const changePassword = async (params: ChangePasswordParams) => {
  try {
    return await apiPut("/users/me/password", params);
  } catch (error) {
    throw formatApiError(error, "Failed to change password");
  }
};
