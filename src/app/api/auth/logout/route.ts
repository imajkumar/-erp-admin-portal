import { type NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/api/services/authService";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token provided",
          data: null,
          status: 401,
          timestamp: new Date().toISOString(),
        },
        { status: 401 },
      );
    }

    // Call the AuthService logout method
    const response = await AuthService.logout();

    // Return the response from AuthService
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Logout API Error:", error);

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
