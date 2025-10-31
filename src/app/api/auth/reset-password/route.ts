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

    // For now, return a mock success response since external API is not working
    // TODO: Replace with actual external API call when it's available
    console.log(`Mock reset password request for email: ${email}, otp: ${otp}`);

    // Mock validation - accept any 6-digit OTP and valid password
    if (otp.length === 6 && /^\d{6}$/.test(otp) && newPassword.length >= 6) {
      return NextResponse.json({
        status: "success",
        message: "Password reset successfully",
        data: null,
        statusCode: 200,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid OTP or password too short",
          data: null,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }
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
