"use server"

import db from "@/db/db"
import OrderHistoryEmail from "@/email/OrderHistory"
import { Resend } from "resend"
import { z } from "zod"

const emailSchema = z.string().email()

if (!process.env.RESEND_API_KEY || !process.env.SENDER_EMAIL) {
  throw new Error("Missing RESEND_API_KEY or SENDER_EMAIL environment variable")
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const rawEmail = formData.get("email")
  if (typeof rawEmail !== "string") {
    return { error: "Email is required" }
  }

  const result = emailSchema.safeParse(rawEmail)

  if (!result.success) {
    return { error: "Invalid email address" }
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    return {
      message:
        "Check your email to view your order history and download your products.",
    }
  }

  const ordersWithVerification = await Promise.all(
    user.orders.map(async (order) => {
      const verification = await db.downloadVerification.create({
        data: {
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          productId: order.product.id,
        },
      });

      return {
        ...order,
        downloadVerificationId: verification.id,
      };
    })
  )

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={ordersWithVerification} />,
  })

  if (data.error) {
    return { error: "There was an error sending your email. Please try again." }
  }

  return {
    message:
      "Check your email to view your order history and download your products.",
  }
}
