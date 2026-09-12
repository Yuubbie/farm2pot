import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Saves an order placed via the bank-transfer / WhatsApp flow.
// Unlike /api/verify-payment (Paystack), there's no server-side payment
// proof here — the transfer is confirmed manually once the customer sends
// proof of payment on WhatsApp. Orders are saved as "pending" so Itoro can
// see what's expected and mark them confirmed once payment comes in.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, total, deliveryType, address } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items in order" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // Don't fail the request — the WhatsApp message is still the
      // source of truth for the order even if we can't log it.
      return NextResponse.json({ success: true, logged: false });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error: insertError } = await supabase.from("orders").insert({
      customer_name: customer?.name ?? null,
      customer_phone: customer?.phone ?? null,
      items,
      total,
      delivery_type: deliveryType,
      address: address ?? null,
      status: "pending",
      payment_method: "bank_transfer",
    });

    if (insertError) {
      console.error("Failed to save order to Supabase:", insertError);
      return NextResponse.json({ success: true, logged: false });
    }

    return NextResponse.json({ success: true, logged: true });
  } catch (err) {
    console.error("create-order error:", err);
    // Still return success=true-ish behavior isn't right here since this
    // is a genuine failure, but we don't want to block the WhatsApp
    // handoff on the client either way — the client ignores this error.
    return NextResponse.json(
      { success: false, error: "Could not save order" },
      { status: 500 }
    );
  }
}
