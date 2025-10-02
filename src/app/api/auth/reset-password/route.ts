import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, newPassword, confirmPassword } = body;

    // Validate required fields
    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          status: "error",
          message: "All fields are required",
          data: null,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          status: "error",
          message: "Passwords do not match",
          data: null,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // Call the external API directly
    const response = await fetch(
      "http://localhost:8060/api/v1/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
          confirmPassword,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: result.message || "Failed to reset password",
          data: null,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
        },
        { status: response.status },
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Reset password API Error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Network error. Please try again.",
        data: null,
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
