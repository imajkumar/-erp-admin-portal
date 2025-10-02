import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
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
    const { currentPin, newPin } = body;

    // Validate inputs
    if (!currentPin || typeof currentPin !== "string") {
      return NextResponse.json(
        { success: false, message: "Current PIN is required" },
        { status: 400 },
      );
    }

    if (!newPin || typeof newPin !== "string") {
      return NextResponse.json(
        { success: false, message: "New PIN is required" },
        { status: 400 },
      );
    }

    // Validate PIN format (4-6 digits)
    if (!/^\d{4,6}$/.test(currentPin) || !/^\d{4,6}$/.test(newPin)) {
      return NextResponse.json(
        { success: false, message: "PINs must be 4-6 digits" },
        { status: 400 },
      );
    }

    // Check if current and new PINs are different
    if (currentPin === newPin) {
      return NextResponse.json(
        {
          success: false,
          message: "New PIN must be different from current PIN",
        },
        { status: 400 },
      );
    }

    // TODO: Verify the JWT token and get user ID
    const userId = "user123"; // This should come from JWT verification

    // TODO: Verify current PIN matches the stored PIN
    // const user = await db.user.findUnique({
    //   where: { id: userId }
    // });
    //
    // if (!user || !user.hasLockPin) {
    //   return NextResponse.json(
    //     { success: false, message: "No PIN set for this account" },
    //     { status: 400 }
    //   );
    // }
    //
    // const isCurrentPinValid = await bcrypt.compare(currentPin, user.lockPin);
    // if (!isCurrentPinValid) {
    //   return NextResponse.json(
    //     { success: false, message: "Current PIN is incorrect" },
    //     { status: 400 }
    //   );
    // }

    // TODO: Hash the new PIN and update in database
    const hashedNewPin = `hashed_${newPin}`; // This should be properly hashed
    // await db.user.update({
    //   where: { id: userId },
    //   data: { lockPin: hashedNewPin }
    // });

    // For demo purposes, we'll just return success
    console.log(`Updating PIN for user ${userId}: ${currentPin} -> ${newPin}`);

    return NextResponse.json({
      success: true,
      message: "PIN updated successfully",
    });
  } catch (error) {
    console.error("Error updating PIN:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
