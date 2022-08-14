import { CreateCommentDto } from './dto/create-comment.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class NewsService {
  private news: News[] = [
    {
      id: 1,
      author: 'DorokhovaNA',
      title: 'title',
      text: 'text',
      comments: [
        {
          id: 1,
          author: 'DorokhovaNA',
          text: 'text',
          date: '2022-08-11T14:17:39.867Z',
          isCanReply: true,
          reply: []
        }
      ],
      date: '2022-08-11T14:15:39.867Z',
      
    },
    {
      id: 2,
      author: 'DorokhovaNA',
      title: 'title2',
      text: 'text2',
      date: '2022-08-11T14:15:39.867Z',
      comments: []
    }
  ]
  create(createNewsDto: CreateNewsDto) {
    const news: News = {
      ...createNewsDto,
      id: this.news.length + 1,
      author: 'DorokhovaNA',
      date: new Date().toUTCString(),
      comments: []
    }
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
      reply: []
    }
    this.news[newsId - 1].comments.push(comment);
  }

  findOne(id: number) {
    const news = this.news.find((news) => news.id === id);

    if (!news) {
      throw new NotFoundException();
    }
    return news
  }

  updateNews(id: number, updateNewsDto: UpdateNewsDto) {
    const news = this.findOne(id);
    const updatedNews: News = {
      ...news,
      ...updateNewsDto,
      date: new Date().toUTCString()
    } 
    this.news[id - 1] = updatedNews;
  }

  updateComment(newsId: number, commentId: number, updateCommentDto: UpdateCommentDto) {
    const news = this.findOne(newsId);
    const comment = news.comments.find((comment) => comment.id === commentId);
    const updateComment: Comment = {
      ...comment,
      ...updateCommentDto,
      date: new Date().toUTCString()
    } 
    this.news[newsId - 1].comments[commentId - 1] = updateComment;
  }

  replyComment(newsId: number, commentId: number, createCommentDto: CreateCommentDto) {
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
      isCanReply: false
    }
    
    this.news[newsId - 1].comments[commentId - 1].reply.push(reply);
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
