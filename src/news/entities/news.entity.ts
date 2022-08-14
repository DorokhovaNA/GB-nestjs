import { Comment } from "./comment.entity";
export class News {
	id: number;
	author: string;
	title: string;
	text: string;
	comments: Comment[];
	date: string;
}
