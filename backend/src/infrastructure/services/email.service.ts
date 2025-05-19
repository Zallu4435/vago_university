// backend/src/infrastructure/services/email.service.ts
import nodemailer from 'nodemailer';
import { config } from '../../config/config';

interface AdmissionOfferEmailParams {
  to: string;
  name: string;
  program: string;
  programDetails: string;
  startDate: string;
  scholarshipInfo: string;
  additionalNotes: string;
  acceptUrl: string;
  rejectUrl: string;
  expiryDays: number;
}

class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  async sendAdmissionOfferEmail({ 
    to, 
    name, 
    program, 
    programDetails, 
    startDate, 
    scholarshipInfo,
    additionalNotes,
    acceptUrl, 
    rejectUrl, 
    expiryDays 
  }: AdmissionOfferEmailParams): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2a5885;">Congratulations, ${name}!</h2>
        <p>We are pleased to inform you that your application to the <strong>${program}</strong> has been reviewed and accepted.</p>
        
        ${programDetails ? `<p><strong>Program Details:</strong> ${programDetails}</p>` : ''}
        ${startDate ? `<p><strong>Start Date:</strong> ${startDate}</p>` : ''}
        ${scholarshipInfo ? `<p><strong>Scholarship Information:</strong> ${scholarshipInfo}</p>` : ''}
        ${additionalNotes ? `<p><strong>Additional Information:</strong> ${additionalNotes}</p>` : ''}
        
        <p>Please confirm your admission by clicking one of the following options:</p>
        
        <div style="margin: 30px 0;">
          <a href="${acceptUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 15px;">
            Accept Offer
          </a>
          <a href="${rejectUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Decline Offer
          </a>
        </div>
        
        <p><strong>Important:</strong> This offer will expire in ${expiryDays} days. Please respond before then.</p>
        
        <p>If you have any questions, please contact our admissions office.</p>
        
        <p>Best regards,<br>
        The Admissions Team</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Admissions Team" <${config.email.from}>`,
      to,
      subject: `Admission Offer: ${program}`,
      html: htmlContent,
    });
    
    console.log(`Admission offer email sent to ${to}`);
  }
}

export const emailService = new EmailService();