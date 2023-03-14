export enum SortPropertyEnum {
  RATING = 'rating',
  PRICE = 'price',
  NAME = 'name',
}

export type Sort = {
  sortName: string;
  sortProperty: SortPropertyEnum;
};

export interface FilterSliceState {
  searchValue: string;
  categoryId: number;
  currentPage: number;
  sortBy: Sort;
}
