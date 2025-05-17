import { apiPut } from "../../lib/api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

interface ChangePinParams {
  oldPin: string;
  newPin: string;
}
interface transactionPin {
  pin: string;
}

export const changePin = async (params: ChangePinParams) => {
  try {
    return await apiPut("/users/me/change-transaction-pin", params);
  } catch (error) {
    throw formatApiError(error, "Failed to change pin");
  }
};
export const transactionPin = async (params: transactionPin) => {
  try {
    return await apiPut("/users/me/transaction-pin", params);
  } catch (error) {
    throw formatApiError(error, "Failed to change pin");
  }
};
