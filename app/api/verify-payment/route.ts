import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, customer, items, total, deliveryType, address } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Missing payment reference" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: "Payment verification isn't configured yet" },
        { status: 500 }
      );
    }

    // Verify directly with Paystack's servers — never trust the client's
    // "success" callback alone, since that can be spoofed.
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status || verifyData.data?.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Payment could not be verified" },
        { status: 400 }
      );
    }

    // Confirm the amount actually paid matches what was ordered (in kobo),
    // to guard against a tampered client-side total.
    const paidAmountKobo = verifyData.data.amount;
    const expectedKobo = Math.round(Number(total) * 100);
    if (paidAmountKobo !== expectedKobo) {
      return NextResponse.json(
        { success: false, error: "Payment amount does not match order total" },
        { status: 400 }
      );
    }

    // Save the order, if Supabase is configured.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error: insertError } = await supabase.from("orders").insert({
        customer_name: customer?.name ?? null,
        customer_phone: customer?.phone ?? null,
        items,
        total,
        delivery_type: deliveryType,
        address: address ?? null,
        status: "confirmed",
        paystack_reference: reference,
      });
      if (insertError) {
        // Payment succeeded even if saving the order record fails —
        // don't fail the whole request, but log it for follow-up.
        console.error("Failed to save order to Supabase:", insertError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong verifying payment" },
      { status: 500 }
    );
  }
}
