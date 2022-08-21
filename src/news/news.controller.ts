import { Express } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  Render,
  Redirect,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';


@Controller('news')
export class NewsController {
  [x: string]: any;
  constructor(
    private readonly newsService: NewsService,
    private mailService: MailService
  ) {}

  @Get()
  @Public()
  @Render('news-list')
  findAll() {
    return { news: this.newsService.findAll() };
  }

  @Post()
  // @Roles('admin')
  @Public()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './public/thumbnails',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createNewsDto: CreateNewsDto,
  ) {
    const thumbnail = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      thumbnail.push(fileReponse);
    });

    let thumbnailPath;

    if (thumbnail[0]?.filename?.length > 0) {
      thumbnailPath = `/thumbnails/${thumbnail[0].filename}`;
    }
    return this.newsService.create({
      ...createNewsDto,
      thumbnail: thumbnailPath,
    });
  }

  @Get(':id')
  @Public()
  @Render('current-news')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Get(':id/create')
  @Render('create-comment')
  getForm(): void {
    return;
  }

  @Post(':id/comment')
  @Public()
  @Redirect('/', 301)
  createComment(
    @Query('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return {comment: this.newsService.createComment(+commentId, createCommentDto)};
  }

  @Post(':id')
  @Public()
  async updateNews(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    const _updateNews = this.newsService.updateNews(+id, updateNewsDto)
    await this.mailService.sendUpdateNewsForAdmins(
      ['nisan261lib@mail.ru', 'nisan261lib@mail.ru'],
      _updateNews,
      );
    return this.newsService.updateNews(+id, updateNewsDto);
  }

  @Get(':id/comments')
  @Public()
  @Render('comment-list')
  getAllComments(@Param('id') id: string) {
    return { comments: this.newsService.getAllComments(+id) };
  }

  @Post('comment/:id')
  @Public()
  updateComment(
    @Query('newsId') newsId: string,
    @Query('commentId') commentId: string,
    @Body() updateCommentDto: UpdateNewsDto,
  ) {
    return this.newsService.updateComment(
      +newsId,
      +commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
