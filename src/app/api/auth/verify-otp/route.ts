import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email and OTP are required",
          data: null,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // Call the external API directly
    const response = await fetch(
      `http://localhost:8060/api/v1/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: result.message || "Failed to verify OTP",
          data: null,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
        },
        { status: response.status },
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Verify OTP API Error:", error);

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
