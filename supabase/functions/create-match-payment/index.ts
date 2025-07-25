import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Create Supabase service client for database writes
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Check if user already has a paid messaging payment
    const { data: existingPayment } = await supabaseService
      .from("match_payments")
      .select("*")
      .eq("user_email", user.email)
      .eq("status", "paid")
      .single();

    if (existingPayment) {
      return new Response(JSON.stringify({ 
        error: "You already have messaging privileges unlocked" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Stripe with your live key
    const stripe = new Stripe("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", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session for messaging unlock
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Unlock Messaging with All Matches",
              description: "Start conversations with all your current and future matches"
            },
            unit_amount: 599, // $5.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/messages?payment=success`,
      cancel_url: `${req.headers.get("origin")}/matches?payment=cancelled`,
      metadata: {
        user_email: user.email,
        feature: "messaging_unlock"
      }
    });

    // Store pending payment
    await supabaseService
      .from("match_payments")
      .insert({
        user_email: user.email,
        user_name: user.user_metadata?.name || "Unknown",
        stripe_session_id: session.id,
        amount: 599,
        status: "pending",
        created_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating messaging payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});