import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Post('comment')
  @Public()
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.newsService.createComment(createCommentDto);
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
    @Body() updateCommentDto: UpdateNewsDto
  ) {
    return this.newsService.updateComment(+newsId, +commentId, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
