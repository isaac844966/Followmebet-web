import { apiPut } from "../../lib/api/apiUtils";
import { formatApiError } from "../utils/errorUtils";

export const uploadAvatar = async (base64Data: string) => {
  try {
    const formattedBase64 = base64Data.includes("base64,")
      ? base64Data
      : `data:image/jpeg;base64,${base64Data}`;

    return await apiPut("/users/me/avatar", {
      data_base64: formattedBase64,
    });
  } catch (error) {
    throw formatApiError(error, "Failed to upload avatar");
  }
};

export const editProfile = async (data: {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  countryId: string;
  stateId: string;
}) => {
  try {
    return await apiPut("/users/me", data);
  } catch (error) {
    throw formatApiError(error, "Failed to update profile");
  }
};
