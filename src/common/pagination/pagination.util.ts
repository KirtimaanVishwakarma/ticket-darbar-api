import { QueryFilter, Model } from 'mongoose';
import { PaginatedResponse } from './pagination.interface';

export async function pagination<T>(
  model: Model<T>,
  filter: QueryFilter<T> = {},
  options: {
    page: number;
    limit: number;
    sort?: Record<string, 1 | -1>;
    select?: string;
    populate?: any;
  },
): Promise<PaginatedResponse<T>> {
  const { page, limit, sort = { createdAt: -1 }, select, populate } = options;

  const skip = (page - 1) * limit;

  const query = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (select) {
    query.select(select);
  }
  if (populate) {
    query.populate(populate);
  }

  const [items, totalItems] = await Promise.all([
    query.lean().exec(),
    model.countDocuments(filter).exec(),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
