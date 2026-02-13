// ----------------- IMPORTS -----------------
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Secret key stored in Render environment variable

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------- MIDDLEWARE -----------------
app.use(cors());
app.use(express.json());

// ----------------- STRIPE CHECKOUT SESSION -----------------
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { total, name, email, date, time } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({ error: "Invalid total amount." });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking for ${name} - ${date} at ${time}`,
            },
            unit_amount: total, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https:// safeandsecuremobilenotary.com/success.html",
      cancel_url: " safeandsecuremobilenotary.com/booking.html",
      customer_email: email,
    });

    res.json({ id: session.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe session creation failed." });
  }
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
