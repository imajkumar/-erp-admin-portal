import { apiClient } from "../client";

export interface CreatePinRequest {
  pin: string;
  confirmPin: string;
}

export interface VerifyPinRequest {
  pin: string;
}

export interface PinResponse {
  hasPin: boolean;
  isLocked: boolean;
  lockedUntil?: string;
  lastUsedAt?: string;
  createdAt?: string;
  failedAttempts: number;
  message: string;
}

export const pinService = {
  // Get PIN status
  async getPinStatus(): Promise<PinResponse> {
    const response = await apiClient.get("users", "/api/v1/pin/status");
    return response.data;
  },

  // Create PIN
  async createPin(data: CreatePinRequest): Promise<PinResponse> {
    const response = await apiClient.post("users", "/api/v1/pin/create", data);
    return response.data;
  },

  // Update PIN
  async updatePin(data: CreatePinRequest): Promise<PinResponse> {
    const response = await apiClient.post("users", "/api/v1/pin/update", data);
    return response.data;
  },

  // Verify PIN
  async verifyPin(data: VerifyPinRequest): Promise<PinResponse> {
    console.log("PIN Service: Verifying PIN with data:", data);
    try {
      const response = await apiClient.post(
        "users",
        "/api/v1/pin/verify",
        data,
      );
      console.log("PIN Service: Response received:", response);
      return response.data;
    } catch (error) {
      console.error("PIN Service: Error during verification:", error);
      throw error;
    }
  },

  // Delete PIN
  async deletePin(): Promise<PinResponse> {
    const response = await apiClient.delete("users", "/api/v1/pin/delete");
    return response.data;
  },
};
