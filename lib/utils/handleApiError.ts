import { UseStatusModalResult } from "../contexts/useStatusModal";

export const handleApiError = (
  error: any,
  showErrorModal: UseStatusModalResult["showErrorModal"],
  defaultMessage = "Something went wrong",
  title = "Error"
) => {
  let errorMessage = defaultMessage;

  try {
    if (error?.response?.data?.errors?.length) {
      const firstError = error.response.data.errors[0];

      if (firstError.details && typeof firstError.details === "string") {
        try {
          const parsedDetails = JSON.parse(firstError.details);
          errorMessage =
            parsedDetails?.message ||
            parsedDetails?.meta?.nextStep ||
            firstError.description ||
            defaultMessage;
        } catch {
          errorMessage =
            firstError.details || firstError.description || defaultMessage;
        }
      } else {
        errorMessage =
          firstError.description || firstError.details || defaultMessage;
      }
    } else if (error.errors && Array.isArray(error.errors)) {
      const firstError = error.errors[0];
      errorMessage =
        firstError.details || firstError.description || defaultMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
  } catch (parseError) {
    console.warn("Error parsing API error:", parseError);
  }

  showErrorModal(errorMessage, title);
};
