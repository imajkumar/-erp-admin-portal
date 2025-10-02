import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email is required",
          data: null,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // For now, return a mock success response since external API is not working
    // TODO: Replace with actual external API call when it's available
    console.log(`Mock forgot password request for email: ${email}`);

    return NextResponse.json({
      status: "success",
      message:
        "If an account with this email exists, a password reset OTP has been sent.",
      data: "If an account with this email exists, a password reset OTP has been sent.",
      statusCode: 200,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Forgot password API Error:", error);

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
