export interface LoginResponse {
  message: string;
  user: string;
  error?: { message: string };
}
