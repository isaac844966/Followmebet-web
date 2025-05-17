import { apiGet } from "../api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

export const getFaqs = async () => {
  try {
    return await apiGet<{ items: any[] }>("/faqs");
  } catch (error) {
    throw formatApiError(error, "Failed to get faqs");
  }
};
