import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "../auth/auth";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      // Return empty array if not logged in
      return NextResponse.json([]);
    }

    const savedAnime = await prisma.savedAnime.findMany({
      where: { userId },
      select: { animeId: true },
    });

    // Returns an array of anime IDs e.g. [101, 202, 303]
    const animeIds = savedAnime.map((item) => item.animeId);

    return NextResponse.json(animeIds);
  } catch (error) {
    console.error("[SAVED_ANIME_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { animeId, title, imageUrl } = body;

    if (!animeId) {
      return NextResponse.json(
        { error: "Anime ID is required" },
        { status: 400 },
      );
    }

    const savedAnime = await prisma.savedAnime.create({
      data: {
        userId,
        animeId: Number(animeId),
        title,
        imageUrl,
      },
    });

    return NextResponse.json(savedAnime);
  } catch (error) {
    console.error("[SAVED_ANIME_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { animeId } = body;

    if (!animeId) {
      return NextResponse.json(
        { error: "Anime ID is required" },
        { status: 400 },
      );
    }

    const deletedAnime = await prisma.savedAnime.delete({
      where: {
        userId_animeId: {
          userId,
          animeId: Number(animeId),
        },
      },
    });

    return NextResponse.json(deletedAnime);
  } catch (error) {
    console.error("[SAVED_ANIME_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
