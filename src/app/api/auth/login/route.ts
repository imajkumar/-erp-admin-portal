import { type NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/api/services/authService";
import { LoginRequest } from "@/store/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email and password are required",
          data: null,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // Use the proper AuthService instead of direct HTTP calls
    const loginRequest: LoginRequest = { email, password, rememberMe };
    const response = await AuthService.login(loginRequest);

    // Return the response from AuthService
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("API Error:", error);

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
          status: "error",
          message: apiError.message,
          data: null,
          statusCode: apiError.status || 500,
          code: apiError.code,
          details: apiError.details,
          timestamp: apiError.timestamp,
        },
        { status: apiError.status || 500 },
      );
    } else {
      // Other error
      return NextResponse.json(
        {
          status: "error",
          message: "Internal server error",
          data: null,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }
  }
}
