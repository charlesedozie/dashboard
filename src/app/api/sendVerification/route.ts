import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// ---------------- CONFIGURATION ---------------- //
const MAIL_HOST = "in-v3.mailjet.com";
const MAIL_PORT = 587;
const MAIL_USERNAME = "a2b4fd6d91b3d02fa687b89d24726b5e";
const MAIL_PASSWORD = "70c665ef1967eee4adc57132f3e7aca1";
const MAIL_FROM = "charles.edozie@nexoristech.com";
const MAIL_FROM_NAME = "GLEEN EDUTech";
const SECRET_ID = "N9HnMguA9-x3oXjUZn4cZ91_M8DLoGc1OVgwh9yJxI8";
const SUPPORT_URL = "https://gleenweb.vercel.app/contact";

// ---------------- CORS HANDLING ---------------- //
export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
  return new NextResponse(null, { status: 204, headers });
}

// ---------------- MAIN HANDLER ---------------- //
export async function POST(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Enforce HTTPS if applicable
    const protocol = req.headers.get("x-forwarded-proto");
if (process.env.NODE_ENV === "production" && protocol !== "https") {
  return NextResponse.json(
    { status: "error", message: "HTTPS required" },
    { status: 403, headers: corsHeaders }
  );
}


    // Parse request body (supports both JSON and form)
    let data: any;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      data = Object.fromEntries(new URLSearchParams(text));
    } else {
      return NextResponse.json(
        { status: "error", message: "Unsupported content type" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { email, otp, id, fullName } = data;
    const subject = "Email Verification";

    // Validate parameters
    if (!email || !otp || !id || id !== SECRET_ID || !fullName) {
      return NextResponse.json(
        { status: "error", message: "Missing or invalid parameters" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { status: "error", message: "Invalid email address" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Load HTML template (e.g., stored in /public)
    const templatePath = path.join(process.cwd(), "public", "email_verification.html");
    const template = fs.readFileSync(templatePath, "utf-8");

    const htmlBody = template
      .replace(/{{OTP_CODE}}/g, otp)
      .replace(/{{firstName}}/g, fullName)
      .replace(/{{year}}/g, new Date().getFullYear().toString())
      .replace(/{{supportUrl}}/g, SUPPORT_URL);

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"${MAIL_FROM_NAME}" <${MAIL_FROM}>`,
      to: email,
      subject,
      html: htmlBody,
      text: htmlBody.replace(/<[^>]+>/g, ""), // plain text fallback
    });

    return NextResponse.json(
      { status: "success", message: "Email sent via Mailjet SMTP" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { status: "error", message: `Mailer Error: ${error.message}` },
      { status: 500, headers: corsHeaders }
    );
  }
}
