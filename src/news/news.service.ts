import { CreateCommentDto } from './dto/create-comment.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class NewsService {
  private news: News[] = [];
  create(createNewsDto: CreateNewsDto) {
    const news: News = {
      ...createNewsDto,
      id: this.news.length + 1,
      author: 'DorokhovaNA',
      date: new Date().toUTCString(),
      comments: [],
      thumbnail: createNewsDto.thumbnail,
    };
    this.news.push(news);
  }

  findAll() {
    return this.news;
  }

  createComment(commentId: number, createCommentDto: CreateCommentDto) {
    const newsId = createCommentDto.id;
    const news = this.findOne(newsId);

    if (commentId) {
      this.replyComment(newsId, commentId, createCommentDto);
      return;
    }

    const comment: Comment = {
      ...createCommentDto,
      id: news.comments.length + 1,
      author: 'DorokhovaNA',
      date: new Date().toUTCString(),
      isCanReply: true,
      reply: [],
    };
    news.comments.push(comment);

    return comment
  }

  findOne(id: number) {
    const news = this.news.find((news) => news.id === id);

    if (!news) {
      throw new NotFoundException();
    }

    return news;
  }

  getAllComments(id: number) {
    const news = this.news.find((news) => news.id === id);

    if (!news) {
      throw new NotFoundException();
    }

    const { comments } = news;

    return comments;
  }

  updateNews(id: number, updateNewsDto: UpdateNewsDto) {
    const news = this.findOne(id);
    const updatedNews: News = {
      ...news,
      ...updateNewsDto,
      date: new Date().toUTCString(),
    };

    return updatedNews;
  }

  updateComment(
    newsId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const news = this.findOne(newsId);
    const comment = news.comments.find((comment) => comment.id === commentId);
    const updateComment: Comment = {
      ...comment,
      ...updateCommentDto,
      date: new Date().toUTCString(),
    };
    this.news[newsId - 1].comments[commentId - 1] = updateComment;
  }

  replyComment(
    newsId: number,
    commentId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const news = this.findOne(newsId);
    const comment = news.comments.find((comment) => comment.id === commentId);

    if (!comment?.isCanReply) {
      throw new NotFoundException();
    }

    const reply: Comment = {
      ...createCommentDto,
      id: comment?.reply.length + 1,
      author: 'DorokhovaNA',
      date: new Date().toUTCString(),
      isCanReply: false,
    };

    this.news[newsId - 1].comments[commentId - 1].reply.push(reply);
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
