import { FilterQuery, Query, Aggregate } from 'mongoose';

export class APIFeatures<T> {
  private query: Query<T[], T> | Aggregate<T[]>;
  private queryString: Record<string, any>;

  constructor(query: Query<T[], T> | Aggregate<T[]>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    try {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

      const parsedQuery: FilterQuery<T> = JSON.parse(queryStr);

      const updatedQuery: Record<string, any> = {};
      for (const key in parsedQuery) {
        if (typeof parsedQuery[key] === 'string') {
          const trimmedValue = parsedQuery[key].trim();

          const safeValue = trimmedValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

          updatedQuery[key] = { $regex: new RegExp(safeValue, 'i') };
        } else {
          updatedQuery[key] = parsedQuery[key];
        }
      }

      Object.assign(parsedQuery, updatedQuery);

      if ('find' in this.query) {
        this.query = this.query.find(parsedQuery) as Query<T[], T>;
      } else if ('match' in this.query) {
        this.query = this.query.match(parsedQuery) as Aggregate<T[]>;
      }
    } catch (error) {
      console.error('Error in filter():', error);
    }

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      if ('sort' in this.query) {
        this.query = this.query.sort(sortBy) as Query<T[], T>;
      } else {
        const sortObj: Record<string, 1 | -1> = {};
        sortBy.split(' ').forEach((field: string) => {
          const direction = field.startsWith('-') ? -1 : 1;
          const fieldName = field.startsWith('-') ? field.slice(1) : field;
          sortObj[fieldName] = direction;
        });

        this.query = (this.query as Aggregate<T[]>).sort(sortObj);
      }
    } else {
      if ('sort' in this.query) {
        this.query = this.query.sort('-createdAt') as Query<T[], T>;
      } else {
        this.query = (this.query as Aggregate<T[]>).sort({ createdAt: -1 });
      }
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      if ('select' in this.query) {
        this.query = this.query.select(fields) as Query<T[], T>;
      } else {
        const fieldObj: Record<string, 1> = {};
        fields.split(' ').forEach((field: string | number) => (fieldObj[field] = 1));

        this.query = (this.query as Aggregate<T[]>).project(fieldObj);
      }
    } else {
      if ('select' in this.query) {
        this.query = this.query.select('-__v') as Query<T[], T>;
      } else {
        this.query = (this.query as Aggregate<T[]>).project({ __v: 0 });
      }
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit)) {
      console.warn('Invalid pagination parameters. Using default values.');
    }

    if ('skip' in this.query && 'limit' in this.query) {
      this.query = this.query.skip(skip).limit(limit) as Query<T[], T>;
    } else {
      this.query = (this.query as Aggregate<T[]>)
        .pipeline()
        .concat([{ $skip: skip }, { $limit: limit }]) as unknown as Aggregate<T[]>;
    }

    return this;
  }

  getQuery(): Query<T[], T> | Aggregate<T[]> {
    return this.query;
  }
}
