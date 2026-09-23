import { NextRequest, NextResponse } from "next/server";
import { INQUIRIES_DATA } from "@/lib/db/mock-data";
import { PartInquiryEntity, InquiryStatus } from "@/types/catalog";
import { sanitizeText, sanitizePartNumber } from "@/lib/security";

/**
 * CUSTOMER TRANSACTION & INQUIRIES API
 * Handles quote requests, parts counter orders, and dealership transaction tracking.
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as InquiryStatus | null;
    const query = searchParams.get("query")?.toLowerCase();

    let inquiries = [...INQUIRIES_DATA];

    if (status && ["pending", "quoted", "completed", "cancelled"].includes(status)) {
      inquiries = inquiries.filter((inq) => inq.status === status);
    }

    if (query) {
      inquiries = inquiries.filter(
        (inq) =>
          inq.transaction_ref.toLowerCase().includes(query) ||
          inq.part_number.toLowerCase().includes(query) ||
          inq.customer_name.toLowerCase().includes(query) ||
          inq.customer_phone.toLowerCase().includes(query) ||
          inq.part_description.toLowerCase().includes(query)
      );
    }

    // Sort by most recent first
    inquiries.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      total: inquiries.length,
      data: inquiries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      part_id,
      part_number,
      part_description,
      vehicle_summary,
      customer_name,
      customer_phone,
      customer_email,
      quantity,
      vin_plate,
      notes,
    } = body;

    // Validate required fields
    if (!part_number || !part_description) {
      return NextResponse.json(
        { success: false, error: "Part number and description are required" },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!customer_phone || !customer_phone.trim()) {
      return NextResponse.json(
        { success: false, error: "Customer phone number is required" },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid quantity (1 or greater) is required" },
        { status: 400 }
      );
    }

    // Generate unique transaction reference code
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const transactionRef = `TXN-NISSAN-${randomSuffix}`;

    const newInquiry: PartInquiryEntity = {
      id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      transaction_ref: transactionRef,
      part_id: part_id || `prt-ref-${cleanNumber(part_number)}`,
      part_number: sanitizePartNumber(part_number),
      part_description: sanitizeText(part_description),
      vehicle_summary: vehicle_summary ? sanitizeText(vehicle_summary) : "Nissan Generic",
      customer_name: sanitizeText(customer_name),
      customer_phone: sanitizeText(customer_phone),
      customer_email: customer_email ? sanitizeText(customer_email) : undefined,
      quantity: Math.floor(qty),
      vin_plate: vin_plate ? sanitizeText(vin_plate).toUpperCase() : undefined,
      notes: notes ? sanitizeText(notes) : undefined,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    INQUIRIES_DATA.unshift(newInquiry);

    return NextResponse.json(
      {
        success: true,
        data: newInquiry,
        transactionRef: newInquiry.transaction_ref,
        message: "Part quote inquiry registered successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process inquiry transaction" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const inquiry = INQUIRIES_DATA.find((inq) => inq.id === id || inq.transaction_ref === id);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: "Inquiry record not found" },
        { status: 404 }
      );
    }

    if (status) {
      if (!["pending", "quoted", "completed", "cancelled"].includes(status)) {
        return NextResponse.json(
          { success: false, error: "Invalid status value" },
          { status: 400 }
        );
      }
      inquiry.status = status as InquiryStatus;
    }

    if (notes !== undefined) {
      inquiry.notes = sanitizeText(notes);
    }

    inquiry.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: inquiry,
      message: "Inquiry status updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

function cleanNumber(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

