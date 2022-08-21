import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { News } from 'src/news/entities/news.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendUpdateNewsForAdmins(emails: string[], updatedNews: News): Promise<void> {
    console.log('Отправляются письма об обновленной новости администрации ресурса');
    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Новость изменена: ${updatedNews.title}`,
          template: './update-news',
          context: updatedNews,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
}
