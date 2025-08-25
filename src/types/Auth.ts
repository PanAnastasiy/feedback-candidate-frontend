export interface AuthData {
  email: string;
  password: string;
  username?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}