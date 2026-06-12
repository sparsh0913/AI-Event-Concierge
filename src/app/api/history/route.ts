import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SearchRequest from "@/models/SearchRequest";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all requests sorted by createdAt descending
    const history = await SearchRequest.find({}).sort({ createdAt: -1 }).exec();

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error("Error in history endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while fetching search history.",
      },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
