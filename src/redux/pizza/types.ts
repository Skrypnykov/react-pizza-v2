import { Sort } from '../filter/types';

export type Pizza = {
  id: string;
  imageUrl: string;
  name: string;
  types: number[];
  sizes: number[];
  price: number;
  category: number;
  rating: number;
};

export type SearchPizzaParams = {
  currentPage: number;
  categoryId: string;
  sortBy: Sort;
  order: string;
  search: string;
};

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'completed',
  ERROR = 'error',
}

export interface PizzaSliceState {
  items: Pizza[];
  status: Status;
}
