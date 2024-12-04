import nodemailer from "nodemailer";

export async function email(event: any, filePath: any) {
  const email = event.input_data.global_values.your_email;
  const emailPassword = event.input_data.global_values.your_password;

  console.log("email : ", email);
  console.log("password : ", emailPassword);

  let errormessage = "error : ";

  console.log("before createTransport");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: emailPassword,
    },
  });
  console.log("after createTransport");

  await transporter
    .sendMail({
      to: email,
      from: email,
      subject: "devrev mail",
      text: "Frustration Detected ", // plain text body
      attachments: [
        {
          filename: "Frustration_Report.pdf",
          path: filePath, // Path to the PDF file
        },
      ],
    })
    .then(() => {
      console.log("Email sent successfully.");
    })
    .catch((error: any) => {
      console.error("Error sending email:", error.toString());
      errormessage += error.toString();
    });
}
