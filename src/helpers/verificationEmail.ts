import { resend } from "@/lib/resend";
import { EmailTemplate } from "../../email-template/EmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";
export async function verificationEmail(
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: email ,
          subject: 'Hello world',
          react: EmailTemplate({ userName,verifyCode }),
        });
        return { success: true, message: "Verification Code Sent Successfully"};
      } catch (error) {
        console.error("Error sending email",error)
        return { success: false, message: "Something went wrong"};
      }
    }
  