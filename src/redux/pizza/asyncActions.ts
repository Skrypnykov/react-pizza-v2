import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { Pizza, SearchPizzaParams } from './types';

export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>(
  'pizza/fetchPizzasStatus',
  async (params) => {
    const { currentPage, categoryId, sortBy, order, search } = params;
    const { data } = await axios.get<Pizza[]>(
      `https://63f10fb05b7cf4107e2c64b7.mockapi.io/api/v2/items?page=${currentPage}&limit=8${categoryId}&sortBy=${sortBy.sortProperty}&order=${order}${search}`,
    );
    return data;
  },
);
