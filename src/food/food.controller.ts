import {
  Controller,
  UseGuards,
  Param,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { FoodService } from './food.service';
import { foodDto } from './dto/food.dto';

@UseGuards(JwtGuard)
@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Get(':id')
  async getFood(
    @Param('id', ParseIntPipe) id: number,
    @Query() { force }: foodDto,
  ) {
    return this.foodService.getFood(id, force);
  }
}
