import { Resend } from "resend";
import { NextResponse } from "next/server";
import ContactFormEmail from "@/components/ContactEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, projectType } = body;

    // Validate required fields
    if (!name || !email || !phone || !projectType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const userEmailPromise = resend.emails.send({
      from: "mail@xvscreations.in",
      to: [email],
      subject: "Thank you for contacting us!",
      react: ContactFormEmail({
        name,
        email,
        phone,
        projectType,
      }),
      replyTo: "info@xvscreations.com",
    });

    const adminEmailPromise = resend.emails.send({
      from: "mail@xvscreations.in",
      //   to: ["sanjeev@xvscreations.com"],
      to: ["snehil.shrivastava@xvscreations.com"],
      subject: `New Contact Form: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p>
          <b>Name:</b> ${name}<br/>
          <b>Email:</b> ${email}<br/>
          <b>Phone:</b> ${phone}<br/>
        </p>
        <hr />
        <h3>Project Type:</h3>
        <p>${projectType.replace(/\n/g, "<br/>")}</p>
      `,
    });

    const [userData, adminData] = await Promise.all([
      userEmailPromise,
      adminEmailPromise,
    ]);

    if (userData.error) {
      console.error("User Confirmation Email Failed:", userData.error);
    }
    if (adminData.error) {
      console.error("Admin Notification Email Failed:", adminData.error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Emails sent successfully",
        adminEmailId: adminData.data?.id,
        userEmailId: userData.data?.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 },
    );
  }
}
