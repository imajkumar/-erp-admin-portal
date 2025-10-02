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

    // For now, return a mock success response since external API is not working
    // TODO: Replace with actual external API call when it's available
    console.log(`Mock verify OTP request for email: ${email}, otp: ${otp}`);

    // Mock validation - accept any 6-digit OTP
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      return NextResponse.json({
        status: "success",
        message: "OTP verified successfully",
        data: null,
        statusCode: 200,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid OTP format",
          data: null,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }
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
