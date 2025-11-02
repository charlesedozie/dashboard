import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// ------------------ CONFIGURATION ------------------ //
const MAIL_HOST = "in-v3.mailjet.com";
const MAIL_PORT = 587;
const MAIL_USERNAME = "a2b4fd6d91b3d02fa687b89d24726b5e";
const MAIL_PASSWORD = "70c665ef1967eee4adc57132f3e7aca1";
const MAIL_FROM = "charles.edozie@nexoristech.com";
const MAIL_FROM_NAME = "GLEEN EDUTech";
const SECRET_ID = "N9HnMguA9-x3oXjUZn4cZ91_M8DLoGc1OVgwh9yJxI8";

// ------------------ HANDLER ------------------ //
export async function POST(req: NextRequest) {
   const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  try {
    // Enforce HTTPS
/*
    if (req.headers.get("x-forwarded-proto") !== "https") {
      return NextResponse.json(
        { status: "error", message: "HTTPS required" },
        { status: 403 }
      );
    }
*/

    const protocol = req.headers.get("x-forwarded-proto");
if (process.env.NODE_ENV === "production" && protocol !== "https") {
  return NextResponse.json(
    { status: "error", message: "HTTPS required" },
    { status: 403, headers: corsHeaders }
  );
}
    const { email, fullName, tempPass, id } = await req.json();

    if (!email || !fullName || !tempPass || !id) {
      return NextResponse.json(
        { status: "error", message: "Missing parameters" },
        { status: 400 }
      );
    }

    if (id !== SECRET_ID) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized request" },
        { status: 403 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { status: "error", message: "Invalid email address" },
        { status: 400 }
      );
    }

    const subject = "Account Creation";
    const loginURL = "https://dashboard-three-chi-33.vercel.app/login";
    const supportURL = "https://gleenweb.vercel.app/contact";

const templatePath = path.join(process.cwd(), "public", "account_template.html");
const template = fs.readFileSync(templatePath, "utf-8");


    // Replace variables
    const htmlBody = template
      .replace(/{{firstName}}/g, fullName)
      .replace(/{{userEmail}}/g, email)
      .replace(/{{tempPassword}}/g, tempPass)
      .replace(/{{loginUrl}}/g, loginURL)
      .replace(/{{year}}/g, new Date().getFullYear().toString())
      .replace(/{{supportUrl}}/g, supportURL);

    // Configure Nodemailer transporter
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
      text: htmlBody.replace(/<[^>]+>/g, ""), // Plain-text version
    });

    return NextResponse.json({
      status: "success",
      message: "Email sent via Mailjet SMTP",
    });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { status: "error", message: `Mailer Error: ${error.message}` },
      { status: 500 }
    );
  }
}
