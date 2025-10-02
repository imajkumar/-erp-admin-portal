import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing or invalid" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const body = await request.json();
    const { pin } = body;

    // Validate PIN
    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, message: "PIN is required" },
        { status: 400 },
      );
    }

    // Validate PIN format (4-6 digits)
    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { success: false, message: "PIN must be 4-6 digits" },
        { status: 400 },
      );
    }

    // TODO: Verify the JWT token and get user ID
    // For now, we'll simulate the user ID
    const userId = "user123"; // This should come from JWT verification

    // TODO: Hash the PIN before storing
    const hashedPin = `hashed_${pin}`; // This should be properly hashed

    // TODO: Store the PIN in the database
    // await db.user.update({
    //   where: { id: userId },
    //   data: { lockPin: hashedPin, hasLockPin: true }
    // });

    // For demo purposes, we'll just return success
    console.log(`Creating PIN for user ${userId}: ${pin}`);

    return NextResponse.json({
      success: true,
      message: "PIN created successfully",
    });
  } catch (error) {
    console.error("Error creating PIN:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
