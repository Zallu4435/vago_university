// // backend/src/infrastructure/services/email.service.ts
// import nodemailer from 'nodemailer';
// import { config } from '../../config/config';

// interface AdmissionOfferEmailParams {
//   to: string;
//   name: string;
//   programDetails: string;
//   startDate: string;
//   scholarshipInfo: string;
//   additionalNotes: string;
//   acceptUrl: string;
//   rejectUrl: string;
//   expiryDays: number;
// }

// class EmailService {
//   private transporter: any;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: config.email.host,
//       port: config.email.port,
//       secure: config.email.secure,
//       auth: {
//         user: config.email.user,
//         pass: config.email.password,
//       },
//     });
//   }

//   async sendAdmissionOfferEmail({ 
//     to, 
//     name, 
//     programDetails, 
//     startDate, 
//     scholarshipInfo,
//     additionalNotes,
//     acceptUrl, 
//     rejectUrl, 
//     expiryDays 
//   }: AdmissionOfferEmailParams): Promise<void> {
//     const htmlContent = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//         <h2 style="color: #2a5885;">Congratulations, ${name}!</h2>
//         <p>We are pleased to inform you that your application to the <strong>${programDetails}</strong> has been reviewed and accepted.</p>
        
//         ${programDetails ? `<p><strong>Program Details:</strong> ${programDetails}</p>` : ''}
//         ${startDate ? `<p><strong>Start Date:</strong> ${startDate}</p>` : ''}
//         ${scholarshipInfo ? `<p><strong>Scholarship Information:</strong> ${scholarshipInfo}</p>` : ''}
//         ${additionalNotes ? `<p><strong>Additional Information:</strong> ${additionalNotes}</p>` : ''}
        
//         <p>Please confirm your admission by clicking one of the following options:</p>
        
//         <div style="margin: 30px 0;">
//           <a href="${acceptUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 15px;">
//             Accept Offer
//           </a>
//           <a href="${rejectUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
//             Decline Offer
//           </a>
//         </div>
        
//         <p><strong>Important:</strong> This offer will expire in ${expiryDays} days. Please respond before then.</p>
        
//         <p>If you have any questions, please contact our admissions office.</p>
        
//         <p>Best regards,<br>
//         The Admissions Team</p>
//       </div>
//     `;

//     await this.transporter.sendMail({
//       from: `"Admissions Team" <${config.email.from}>`,
//       to,
//       subject: `Admission Offer: ${programDetails}`,
//       html: htmlContent,
//     });
    
//     console.log(`Admission offer email sent to ${to}`);
//   }
// }

// export const emailService = new EmailService();





import nodemailer from 'nodemailer';
import { config } from '../../config/config';

interface AdmissionOfferEmailParams {
  to: string;
  name: string;
  programDetails: string;
  startDate: string;
  scholarshipInfo: string;
  additionalNotes: string;
  acceptUrl: string;
  rejectUrl: string;
  expiryDays: number;
}

interface FacultyOfferEmailParams {
  to: string;
  name: string;
  department: string;
  position: string;
  startDate: string;
  salary?: string;
  benefits?: string;
  additionalNotes?: string;
  acceptUrl: string;
  rejectUrl: string;
  expiryDays: number;
}

interface FacultyCredentialsEmailParams {
  to: string;
  name: string;
  email: string;
  password: string;
  loginUrl: string;
  department: string;
  additionalInstructions?: string;
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
        <p>We are pleased to inform you that your application to the <strong>${programDetails}</strong> has been reviewed and accepted.</p>
        
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
      subject: `Admission Offer: ${programDetails}`,
      html: htmlContent,
    });
    
    console.log(`Admission offer email sent to ${to}`);
  }

  async sendFacultyOfferEmail({
    to,
    name,
    department,
    position,
    startDate,
    salary,
    benefits,
    additionalNotes,
    acceptUrl,
    rejectUrl,
    expiryDays
  }: FacultyOfferEmailParams): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2a5885;">Faculty Appointment Offer for ${name}</h2>
        
        <p>Dear ${name},</p>
        
        <p>We are pleased to offer you a faculty position in the <strong>${department}</strong> department at our institution.</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #2a5885; padding: 15px; margin: 20px 0;">
          // <p><strong>Position:</strong> ${position}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Start Date:</strong> ${startDate}</p>
          ${salary ? `<p><strong>Salary:</strong> ${salary}</p>` : ''}
          ${benefits ? `<p><strong>Benefits:</strong> ${benefits}</p>` : ''}
        </div>
        
        ${additionalNotes ? `<p><strong>Additional Information:</strong> ${additionalNotes}</p>` : ''}
        
        <p>We are excited about the possibility of you joining our academic community and believe your expertise will be a valuable addition to our institution.</p>
        
        <p>Please respond to this offer by clicking one of the following options:</p>
        
        <div style="margin: 30px 0;">
          <a href="${acceptUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 15px;">
            Accept Position
          </a>
          <a href="${rejectUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Decline Position
          </a>
        </div>
        
        <p><strong>Important:</strong> This offer will expire in ${expiryDays} days. Please respond before then.</p>
        
        <p>Upon acceptance, you will receive your login credentials and further onboarding information.</p>
        
        <p>If you have any questions or need additional information, please do not hesitate to contact us.</p>
        
        <p>Best regards,<br>
        The Faculty Affairs Office</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Faculty Affairs Office" <${config.email.from}>`,
      to,
      subject: `Faculty Position Offer: ${position} in ${department}`,
      html: htmlContent,
    });
    
    console.log(`Faculty offer email sent to ${to}`);
  }

  async sendFacultyCredentialsEmail({
    to,
    name,
    email,
    password,
    loginUrl,
    department,
    additionalInstructions
  }: FacultyCredentialsEmailParams): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2a5885;">Welcome to the Faculty, ${name}!</h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for accepting our offer to join the ${department} department. We are excited to have you as part of our academic community.</p>
        
        <p>Below are your login credentials for the faculty dashboard:</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #2a5885; padding: 15px; margin: 20px 0;">
          <p><strong>Email/Username:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
        </div>
        
        <p><strong>Important:</strong> For security reasons, please change your password after your first login.</p>
        
        ${additionalInstructions ? `<p><strong>Additional Instructions:</strong> ${additionalInstructions}</p>` : ''}
        
        <p>The faculty dashboard will provide you with access to important resources, class schedules, student information, and other administrative tools.</p>
        
        <p>If you have any questions or need assistance, please contact our IT support team.</p>
        
        <p>We look forward to your contributions and collaboration.</p>
        
        <p>Best regards,<br>
        The Faculty Affairs Office</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Faculty Affairs Office" <${config.email.from}>`,
      to,
      subject: `Your Faculty Dashboard Credentials`,
      html: htmlContent,
    });
    
    console.log(`Faculty credentials email sent to ${to}`);
  }
}

export const emailService = new EmailService();