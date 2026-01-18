import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get("userRole") || "PARTICIPANT";

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        questions: {
          where: {
            targetRole: userRole as "PARTICIPANT" | "VOLUNTEER",
          },
        },
        bookings: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event details" },
      { status: 500 }
    );
  }
}
