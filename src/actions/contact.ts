"use server";

import { contactFormSchema } from "@/lib/validations";
import { createContactMessage } from "@/lib/db";
import { headers } from "next/headers";

export interface ContactActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactActionResult> {
  try {
    const validated = contactFormSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        message: "Please correct the highlighted errors.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "unknown";

    await createContactMessage({
      name: validated.data.name.trim(),
      email: validated.data.email.trim(),
      message: validated.data.message.trim(),
      ipAddress: ip,
    });

    return {
      success: true,
      message: "Thank you for reaching out, Shivam! Your message has been sent successfully. I'll get back to you shortly.",
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while sending your message. Please try again or reach out directly on LinkedIn.",
    };
  }
}
