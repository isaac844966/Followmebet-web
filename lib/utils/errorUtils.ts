import type { ApiError } from "../api/apiUtils"

/**
 * Utility function to format API errors consistently
 * This ensures all errors follow the same structure across the application
 *
 * @param error The error caught from API calls
 * @param defaultMessage Default message to show if error details aren't available
 * @returns Formatted ApiError object
 */
export const formatApiError = (error: any, defaultMessage: string): ApiError => {
  let errorMessage = defaultMessage

  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    // Get the details from the first error in the array format
    errorMessage = error.errors[0]?.details || error.errors[0]?.description || defaultMessage
  } else if (error.message) {
    errorMessage = error.message
  }

  // Return the formatted error, preserving the original error structure
  return {
    message: errorMessage,
    status: error.status || 500,
    errors: error.errors || [],
  }
}

/**
 * Converts API error details to validation errors format
 * Use this for converting API errors to form field errors
 *
 * @param apiError The API error response
 * @returns An object with field names as keys and error messages as values
 */
export const mapApiErrorToValidationErrors = (apiError: ApiError): Record<string, string> => {
  const validationErrors: Record<string, string> = {}

  if (Array.isArray(apiError.errors)) {
    // If we have API error details in array format, add a general error
    validationErrors.general = apiError.message

    // Optionally map specific error types to specific form fields
    apiError.errors.forEach((error) => {
      if (error.reason === "UNAUTHORIZED") {
        validationErrors.general = error.details || "Invalid credentials"
      }
      // Add more mappings as needed
    })
  } else if (apiError.errors && typeof apiError.errors === "object") {
    // If errors are already in field:message format, use them directly
    Object.assign(validationErrors, apiError.errors)
  } else {
    // Fallback to general error
    validationErrors.general = apiError.message
  }

  return validationErrors
}
