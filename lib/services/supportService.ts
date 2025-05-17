import { apiPost } from "../api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

interface SupportMessageParams {
  reason: string;
  message: string;
}

export const sendSupportMessage = async ({
  reason,
  message,
}: SupportMessageParams) => {
  try {
    return await apiPost("/support/messages", {
      reason,
      message,
    });
  } catch (error) {
    throw formatApiError(error, "Failed to send support message");
  }
};
