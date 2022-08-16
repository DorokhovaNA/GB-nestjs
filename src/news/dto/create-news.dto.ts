import { IsString, Length } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @Length(5, 20)
  title: string;

  @IsString()
  @Length(50, 250)
  text: string;

  thumbnail: string[];
}
