import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { catchError, map } from 'rxjs';

@Injectable()
export class FoodService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getFood(id: number, force: boolean) {
    const BASE_URL = 'https://world.openfoodfacts.org/api/v0/product/';

    let cachedFood: object = await this.cacheManager.get(id.toString());
    if (cachedFood && !force) {
      cachedFood = JSON.parse(cachedFood.toString());
      return {
        ...cachedFood,
        _cached: true,
      };
    }
    return this.httpService
      .get(BASE_URL + `${id}.json`)
      .pipe(
        map(async (response) => {
          if (response.data.status === 0) {
            throw new NotFoundException('Food not found');
          }
          await this.cacheManager.set(
            id.toString(),
            JSON.stringify(response.data),
            60 * 60 * 24,
          );
          return response.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('External API Unavailable');
        }),
      );
  }
}
