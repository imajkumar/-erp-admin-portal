import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing or invalid" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);

    // TODO: Verify the JWT token and get user ID
    const userId = "user123"; // This should come from JWT verification

    // TODO: Check if user has a PIN set
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

    // TODO: Remove PIN from database
    // await db.user.update({
    //   where: { id: userId },
    //   data: {
    //     lockPin: null,
    //     hasLockPin: false
    //   }
    // });

    // For demo purposes, we'll just return success
    console.log(`Resetting PIN for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "PIN reset successfully",
    });
  } catch (error) {
    console.error("Error resetting PIN:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
