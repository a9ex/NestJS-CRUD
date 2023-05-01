import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class foodDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  force: boolean;
}
