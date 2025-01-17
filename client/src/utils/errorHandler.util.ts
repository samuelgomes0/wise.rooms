import { Notification } from "@/constants";
import { ApiError } from "@/types";

interface ToastProps {
  title: string;
  description: string;
}

function errorHandler(error: ApiError): ToastProps {
  const { code, message } = error.response.data;

  switch (code) {
    case "BOOKING_ALREADY_CANCELLED":
      return {
        title: Notification.ERROR.BOOKING.ALREADY_CANCELLED_TITLE,
        description: Notification.ERROR.BOOKING.ALREADY_CANCELLED_DESCRIPTION,
      };
    case "BOOKING_PAST_DATE":
      return {
        title: Notification.ERROR.BOOKING.PAST_DATE_TITLE,
        description: Notification.ERROR.BOOKING.PAST_DATE_DESCRIPTION,
      };
    case "BOOKING_CANNOT_CANCEL":
      return {
        title: Notification.ERROR.BOOKING.CANNOT_CANCEL_TITLE,
        description: Notification.ERROR.BOOKING.CANNOT_CANCEL_DESCRIPTION,
      };
    case "UNAUTHORIZED":
      return {
        title: Notification.ERROR.BOOKING.UNAUTHORIZED_TITLE,
        description: Notification.ERROR.BOOKING.UNAUTHORIZED_DESCRIPTION,
      };
    case "BOOKING_NOT_FOUND":
      return {
        title: Notification.ERROR.BOOKING.NOT_FOUND_TITLE,
        description: Notification.ERROR.BOOKING.NOT_FOUND_DESCRIPTION,
      };
    case "BOOKING_CONFLICT":
      return {
        title: Notification.ERROR.BOOKING.CONFLICT_TITLE,
        description: Notification.ERROR.BOOKING.CONFLICT_DESCRIPTION,
      };
    case "BOOKING_ALREADY_COMPLETED":
      return {
        title: Notification.ERROR.BOOKING.ALREADY_COMPLETED_TITLE,
        description: Notification.ERROR.BOOKING.ALREADY_COMPLETED_DESCRIPTION,
      };
    default:
      return {
        title: "An error occurred.",
        description: message,
      };
  }
}

export default errorHandler;
