
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";



import {
  format
} from "date-fns";

export const formattedDate = (date: any) => {
  try {
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  } catch {
    return date;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
