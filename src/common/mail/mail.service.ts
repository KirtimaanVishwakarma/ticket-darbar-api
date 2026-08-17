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

            subject: 'Verify your Ticket Darbar account',
            template: "emails/verify-email",
            context: {
              name, verificationUrl
            }
        });

    }

}
