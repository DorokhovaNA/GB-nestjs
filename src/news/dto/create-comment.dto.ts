import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @Length(5, 50)
  text: string;
}
