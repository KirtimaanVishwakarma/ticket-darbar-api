import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmailVarification(email: string,
        name: string,
        verificationToken: string,) {
        const verificationUrl =
            `http://localhost:3000/api/v1/auth/verify-email?token=${verificationToken}`;

        await this.mailerService.sendMail({
            to: email,

            subject: 'Verify your email',

            html: `
        <div>
          <h2>Hello ${name}</h2>

          <p>
            Thank you for registering with Ticket Darbar.
          </p>

          <p>
            Click the button below to verify your email.
          </p>

          <a
            href="${verificationUrl}"
            style="
              padding: 10px 20px;
              background: #e53935;
              color: white;
              text-decoration: none;
            "
          >
            Verify Email
          </a>

          <p>
            This link will expire soon.
          </p>
        </div>
      `,
        });

    }

}
