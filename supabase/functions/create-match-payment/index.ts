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

  try {
    const { userEmail, userName } = await req.json();
    if (!userEmail || !userName) {
      throw new Error("User email and name are required");
    }

    // Initialize Stripe
    const stripe = new Stripe("sk_test_51RnvNVQ9BeFdofGd81eLtN9RKKYySVV9NVhbI9HqDgYJovDCfPw854bWeEwV8Qs8eBq3C3VkQPPUg74kiP5WnHbi00KuIaQmuR", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Unlock All Matches & Messaging",
              description: "Access all your memory matches and unlimited messaging"
            },
            unit_amount: 599, // $5.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/?payment=success`,
      cancel_url: `${req.headers.get("origin")}/?payment=cancelled`,
      metadata: {
        user_email: userEmail,
        user_name: userName,
        feature: "match_unlock_all"
      }
    });

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Store pending payment
    await supabaseService
      .from("match_payments")
      .insert({
        user_email: userEmail,
        user_name: userName,
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
    console.error("Error creating match payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});