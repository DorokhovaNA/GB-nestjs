export class Comment {
	id: number;
	author: string;
	text: string;
	date: string;
	isCanReply: boolean;
	reply?: Comment[];
}
