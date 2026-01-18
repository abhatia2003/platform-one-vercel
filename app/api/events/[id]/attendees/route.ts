import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role"); // Optional: filter by role

    const bookings = await prisma.booking.findMany({
      where: {
        eventId: id,
        ...(roleFilter && { roleAtBooking: roleFilter as "PARTICIPANT" | "VOLUNTEER" }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            tier: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Transform the data to match frontend expectations
    const attendees = bookings.map((booking) => ({
      id: booking.id,
      userId: booking.user.id,
      name: booking.user.name,
      email: booking.user.email,
      tier: booking.user.tier || "BRONZE",
      role: booking.roleAtBooking,
      checkedIn: false, // You can add check-in tracking to the schema if needed
      dietary: "", // Add dietary preference to schema if needed
      referral: "", // Add referral source to schema if needed
    }));

    return NextResponse.json(attendees);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}
