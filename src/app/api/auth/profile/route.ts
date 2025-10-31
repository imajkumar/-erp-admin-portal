import { type NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/api/services/authService";

// GET - Get user profile
export async function GET(request: NextRequest) {
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

    // Call the AuthService getProfile method
    const response = await AuthService.getProfile();

    // Return the response from AuthService
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Get Profile API Error:", error);

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

// PUT - Update user profile
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { firstName, lastName, email, phone, username, bio, location } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "First name, last name, and email are required",
          data: null,
          status: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // Prepare profile data
    const profileData = {
      firstName,
      lastName,
      email,
      phone: phone || null,
      username: username || null,
      bio: bio || null,
      location: location || null,
    };

    // Call the AuthService updateProfile method
    const response = await AuthService.updateProfile(profileData);

    // Return the response from AuthService
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Update Profile API Error:", error);

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
