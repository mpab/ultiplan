import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String, format: 'date-time' })
  created_on: string;

  @ApiProperty({ type: String, format: 'date-time' })
  started_on: string;

  @ApiProperty({ type: String, format: 'date-time' })
  completed_on: string;

  @ApiProperty({ type: String, format: 'date-time' })
  due_on: string;

  @ApiPropertyOptional({ type: Array<string> })
  tags: string[];
}
