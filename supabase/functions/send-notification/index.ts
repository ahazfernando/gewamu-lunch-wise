import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userEmail: string;
  featureName: string;
  errorMessage?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, featureName, errorMessage }: NotificationRequest = await req.json();

    console.log("Sending notification email to:", userEmail, "for feature:", featureName);

    const emailResponse = await resend.emails.send({
      from: "LunchPay <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Feature Issue: ${featureName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
            Feature Temporarily Unavailable
          </h1>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hello,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We wanted to let you know that the <strong>${featureName}</strong> feature you tried to access is currently experiencing issues and is temporarily unavailable.
          </p>
          
          ${errorMessage ? `
            <div style="background-color: #f8f9fa; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #721c24; font-size: 14px;">
                <strong>Error Details:</strong> ${errorMessage}
              </p>
            </div>
          ` : ''}
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Our team has been notified and is working to resolve this issue as quickly as possible. We apologize for any inconvenience this may cause.
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            In the meantime, you can:
          </p>
          
          <ul style="color: #666; font-size: 16px; line-height: 1.6;">
            <li>Try again later</li>
            <li>Contact our support team if you continue experiencing issues</li>
            <li>Use alternative features in the meantime</li>
          </ul>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for your patience and understanding.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              The LunchPay Team
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Notification email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to send notification email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);