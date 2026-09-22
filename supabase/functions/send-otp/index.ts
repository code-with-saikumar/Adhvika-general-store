import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Check if user exists
    const { data: users, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) throw listErr;
    const userExists = users.users.some((u: any) => u.email === email.toLowerCase());

    if (!userExists) {
      // Return success even if user doesn't exist (prevent email enumeration)
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous unused OTPs for this email
    await supabaseAdmin
      .from('password_reset_otps')
      .update({ used: true })
      .eq('email', email.toLowerCase())
      .eq('used', false);

    // Store OTP
    const { error: insertErr } = await supabaseAdmin
      .from('password_reset_otps')
      .insert({ email: email.toLowerCase(), otp_code: otp, expires_at: expiresAt.toISOString() });

    if (insertErr) throw insertErr;

    // Send email via Gmail SMTP
    const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');
    if (!GMAIL_APP_PASSWORD) throw new Error('GMAIL_APP_PASSWORD not configured');

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: "adhvikageneralstore@gmail.com", pass: GMAIL_APP_PASSWORD },
    });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#D4AF37,#B8860B);padding:20px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;margin:0;">Password Reset</h1>
        </div>
        <div style="padding:30px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
          <p>Hi there,</p>
          <p>You requested a password reset for your Adhvika General Store account. Use the OTP code below:</p>
          <div style="text-align:center;margin:30px 0;">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#f5f5f5;padding:15px 30px;border-radius:8px;border:2px dashed #D4AF37;">${otp}</span>
          </div>
          <p style="color:#666;font-size:14px;">This code expires in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
          <p style="color:#666;font-size:14px;margin-top:20px;">— Adhvika General Store 🙏</p>
        </div>
      </div>`;

    await transporter.sendMail({
      from: "Adhvika General Store <adhvikageneralstore@gmail.com>",
      to: email,
      subject: "Password Reset OTP - Adhvika General Store",
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Send OTP error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
