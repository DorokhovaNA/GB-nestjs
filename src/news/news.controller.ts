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
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
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
  constructor(private readonly newsService: NewsService) {}

  @Post()
  // @Roles('admin')
  @Public()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads/thumbnails',
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
    return this.newsService.create({ ...createNewsDto, thumbnail });
  }

  @Post('comment')
  @Public()
  createComment(
    @Query('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.newsService.createComment(+commentId, createCommentDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Post(':id')
  @Public()
  updateNews(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(+id, updateNewsDto);
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
