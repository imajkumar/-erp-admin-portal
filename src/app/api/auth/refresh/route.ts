import { type NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/api/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validate required fields
    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
          data: null,
          status: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // Use the AuthService to refresh the token
    const response = await AuthService.refreshToken(refreshToken);

    // Return the response from AuthService
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Refresh Token API Error:", error);

    // Handle different types of errors
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as {
        message: string;
        status: number;
        code?: string;
        details?: any;
        timestamp: string;
      };

      return NextResponse.json(
        {
          success: false,
          message: apiError.message,
          data: null,
          status: apiError.status,
          code: apiError.code,
          details: apiError.details,
          timestamp: apiError.timestamp,
        },
        { status: apiError.status },
      );
    } else {
      // Other error
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          data: null,
          status: 500,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }
  }
}
