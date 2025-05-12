// In processPayment.ts
import { Payment } from "../../../infrastructure/database/mongoose/models/payment.model"; // Correct import statement
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  STRIPE = "stripe",
}

enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

interface PaymentDetails {
  method: PaymentMethod | string;
  amount: number;
  currency: string;
  paymentMethodId?: string;
  returnUrl?: string;
}

class ProcessPayment {
  async execute(applicationId: string, paymentDetails: PaymentDetails) {
    try {
      // Validate payment details
      this.validatePaymentDetails(paymentDetails);

      // Generate a default return URL if not provided
      const returnUrl =
        paymentDetails.returnUrl ||
        `${process.env.APP_BASE_URL || "http://localhost:3000"}/application/payment-return`;

      // Create payment intent (using test mode)
      const paymentIntent = await this.createStripePaymentIntent(
        paymentDetails.amount,
        paymentDetails.currency,
        paymentDetails.paymentMethodId,
        returnUrl
      );

      // Create payment record
      const payment = await this.createPaymentRecord(applicationId, paymentDetails, paymentIntent);

      return {
        paymentId: payment._id.toString(),
        status: payment.status,
        message: this.getPaymentMessage(paymentIntent.status),
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error: any) {
      console.error("Payment processing error:", error);
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  private validatePaymentDetails(paymentDetails: PaymentDetails) {
    if (!paymentDetails.method || !paymentDetails.amount || !paymentDetails.currency) {
      throw new Error("Invalid payment details: method, amount, and currency are required");
    }
  }

  private async createStripePaymentIntent(
    amount: number,
    currency: string,
    paymentMethodId?: string,
    returnUrl?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "always", // Allow all redirect-based payment methods
        },
        return_url: returnUrl,
        // Ensure payment is confirmed
        confirm: true,
      };

      // Only add payment_method if provided
      if (paymentMethodId) {
        (paymentIntentOptions as any).payment_method = paymentMethodId;
      } else {
        // Fallback to a test card if no payment method is provided
        (paymentIntentOptions as any).payment_method = "pm_card_visa";
      }

      return await stripe.paymentIntents.create(paymentIntentOptions);
    } catch (error: any) {
      console.error("Stripe PaymentIntent creation error:", error);
      throw error;
    }
  }

  private async createPaymentRecord(
    applicationId: string,
    paymentDetails: PaymentDetails,
    paymentIntent: Stripe.PaymentIntent
  ) {
    const payment = new Payment({
      applicationId,
      paymentDetails: {
        method: paymentDetails.method,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        stripePaymentIntentId: paymentIntent.id,
      },
      // Map to predefined enum statuses
      status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
    });

    return await payment.save();
  }

  private mapStripeStatusToPaymentStatus(stripeStatus: string | null): PaymentStatus {
    switch (stripeStatus) {
      case "succeeded":
        return PaymentStatus.COMPLETED;
      case "processing":
        return PaymentStatus.PENDING;
      default:
        return PaymentStatus.FAILED;
    }
  }

  private getPaymentMessage(status: string | null): string {
    switch (status) {
      case "succeeded":
        return "Payment processed successfully";
      case "requires_payment_method":
        return "Additional payment method required";
      case "requires_confirmation":
      case "requires_action":
        return "Additional verification required";
      case "processing":
        return "Payment is processing";
      default:
        return "Payment failed";
    }
  }
}

export const processPayment = new ProcessPayment();
