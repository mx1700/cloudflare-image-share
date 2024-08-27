import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characterCount = characters.length;
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[randomValues[i] % characterCount];
  }
  return result;
}

export function getFileExtension(filename: string): string {
  return filename.substring(filename.lastIndexOf('.') + 1);
}

export function formatFileSize(fileSizeMB: number) {
  if(fileSizeMB < 1) {
    return `${(fileSizeMB * 1000).toFixed(0)} KB`;
  } else {
    return `${fileSizeMB.toFixed(0)} MB`;
  }
}