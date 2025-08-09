// src/routes/(marketing)/join/+page.server.ts
import { fail } from "@sveltejs/kit"
import { sendTemplatedEmail } from "$lib/mailer"
import { WebsiteBaseUrl } from "../../../config"
import type { Actions } from "./$types"

export const actions: Actions = {
  default: async ({ request, locals: { supabaseServiceRole } }) => {
    const formData = await request.formData()
    const fullName = formData.get("full_name")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()

    // --- Basic Validation ---
    if (!email || !fullName) {
      return fail(400, {
        error: "Please provide both your name and email.",
        fullName,
        email,
      })
    }
    if (!email.includes("@")) {
      return fail(400, {
        error: "Please provide a valid email address.",
        fullName,
        email,
      })
    }

    // --- Database Insert ---
    const { error: insertError } = await supabaseServiceRole
      .from("waitlist_signups")
      .insert({
        full_name: fullName,
        email: email,
      })

    if (insertError) {
      // Handle potential duplicate email error gracefully
      if (insertError.code === "23505") {
        // Unique violation
        return fail(409, {
          // 409 Conflict
          error: "This email address is already on the waitlist!",
          fullName,
          email,
        })
      }
      console.error("Error saving waitlist signup:", insertError)
      return fail(500, {
        error: "An error occurred on our end. Please try again.",
        fullName,
        email,
      })
    }

    // --- Send Confirmation Email ---
    await sendTemplatedEmail({
      subject: "You're on the Waitlist for Nanowrit Labs!",
      to_emails: [email],
      from_email: "no-reply@mail.nanowritlabs.com",
      template_name: "waitlist_confirmation",
      template_properties: {
        fullName: fullName,
        WebsiteBaseUrl: WebsiteBaseUrl,
      },
    })

    return { success: true }
  },
}
