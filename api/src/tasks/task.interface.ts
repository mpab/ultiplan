import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;

  @ApiPropertyOptional({ type: String })
  tags: string;
}
