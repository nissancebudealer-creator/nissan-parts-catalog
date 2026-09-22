import { NextRequest, NextResponse } from "next/server";
import { PARTS_DATA, PART_COMPATIBILITY_DATA } from "@/lib/db/mock-data";
import { PartEntity } from "@/types/catalog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase();
    const category = searchParams.get("category");

    let parts = [...PARTS_DATA];

    if (category && category !== "all") {
      parts = parts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (query) {
      parts = parts.filter(
        (p) =>
          p.part_number.toLowerCase().includes(query) ||
          p.part_description.toLowerCase().includes(query) ||
          (p.notes && p.notes.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      total: parts.length,
      data: parts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch parts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { part_number, part_description, category, subcategory, notes } = body;

    if (!part_number || !part_description || !category) {
      return NextResponse.json(
        { success: false, error: "Part number, description, and category are required" },
        { status: 400 }
      );
    }

    const cleanNumber = part_number.trim().toUpperCase();
    const existing = PARTS_DATA.find((p) => p.part_number.toUpperCase() === cleanNumber);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Part number ${cleanNumber} already exists` },
        { status: 409 }
      );
    }

    const newPart: PartEntity = {
      id: `prt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      part_number: cleanNumber,
      part_description: part_description.trim(),
      category: category.trim(),
      subcategory: subcategory?.trim() || undefined,
      notes: notes?.trim() || undefined,
      active: true,
    };

    PARTS_DATA.unshift(newPart);

    return NextResponse.json({
      success: true,
      data: newPart,
      message: "Part created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create part" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active, part_description, category, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Part id is required" }, { status: 400 });
    }

    const part = PARTS_DATA.find((p) => p.id === id);
    if (!part) {
      return NextResponse.json({ success: false, error: "Part not found" }, { status: 404 });
    }

    if (typeof active === "boolean") part.active = active;
    if (part_description) part.part_description = part_description;
    if (category) part.category = category;
    if (notes !== undefined) part.notes = notes;

    return NextResponse.json({
      success: true,
      data: part,
      message: "Part updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update part" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Part id is required" }, { status: 400 });
    }

    const index = PARTS_DATA.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Part not found" }, { status: 404 });
    }

    const removed = PARTS_DATA.splice(index, 1)[0];

    // Remove associated compatibility entries
    const initialCompatCount = PART_COMPATIBILITY_DATA.length;
    for (let i = PART_COMPATIBILITY_DATA.length - 1; i >= 0; i--) {
      if (PART_COMPATIBILITY_DATA[i].part_id === id) {
        PART_COMPATIBILITY_DATA.splice(i, 1);
      }
    }

    return NextResponse.json({
      success: true,
      data: removed,
      compatibilitiesRemoved: initialCompatCount - PART_COMPATIBILITY_DATA.length,
      message: "Part deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete part" },
      { status: 500 }
    );
  }
}
