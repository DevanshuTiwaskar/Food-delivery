import nodemailer from "nodemailer";

// Create a transporter using environment variables or fallback to a mock Ethereal test account
const createTransporter = async () => {
  // If real SMTP credentials are provided in .env, use them to send real emails
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 465,
      secure: true, // true for 465, false for other ports (587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Otherwise, fallback to Ethereal mock emails for local testing
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
};

// Function called by verifyOrder when a Stripe payment returns success
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const transporter = await createTransporter();

    // Build the order items HTML list dynamically
    const itemsHtml = orderDetails.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">x${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
          </tr>`
      )
      .join("");

    // Send Mail
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Cravely Updates" <noreply@cravely.com>', // sender address
      to: userEmail, // list of receivers
      subject: "Order Confirmed - Cravely 🍔", // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ececec; border-radius: 10px;">
          <h2 style="color: #ff6347; text-align: center;">Order Confirmed! 🎉</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #555;">Thank you for ordering with Cravely. Your payment has been securely processed and your food is now being prepared!</p>
          
          <h3 style="border-bottom: 2px solid #ff6347; padding-bottom: 10px; color: #333;">Order Summary (ID: ${orderDetails._id})</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <p style="text-align: right; font-size: 18px; font-weight: bold; color: #333; margin-top: 20px;">
            Total Paid: ₹${orderDetails.amount}
          </p>
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">
            If you have any questions about this order, please contact support@cravely.com. 
          </p>
          <p style="font-size: 14px; color: #777; text-align: center;">
            Enjoy your meal! - The Cravely Team
          </p>
        </div>
      `, // html body
    });

    // Only print the preview URL if we are using the Ethereal Mock service
    if (!process.env.SMTP_USER) {
      console.log("=============================================");
      console.log("Mock Email Sent!");
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      console.log("=============================================");
    } else {
      console.log("Real Email successfully sent to", userEmail);
    }
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

export default sendOrderConfirmationEmail;
