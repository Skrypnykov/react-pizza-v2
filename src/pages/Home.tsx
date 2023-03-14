import React from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Categories, SortPopup, PizzaBlock, Skeleton, Pagination } from '../components';
import { sortList } from '../components/Sort';

import { useAppDispatch } from '../redux/store';

import { fetchPizzas } from '../redux/pizza/asyncActions';
import { selectPizzaData } from '../redux/pizza/selectors';
import { SearchPizzaParams } from '../redux/pizza/types';
import { setCategory, setCurrentPage, setFilters } from '../redux/filter/slice';
import { selectFilter } from '../redux/filter/selectors';
import { SortPropertyEnum } from '../redux/filter/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = React.useRef(false);

  const { items, status } = useSelector(selectPizzaData);
  const { searchValue, categoryId, currentPage, sortBy } = useSelector(selectFilter);

  const onClickCategory = React.useCallback((idx: number) => {
    dispatch(setCategory(idx));
  }, []);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = () => {
    const category = categoryId > 0 ? `&category=${categoryId}` : '';
    const order = sortBy.sortProperty === SortPropertyEnum.RATING ? 'desc' : 'asc';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        categoryId: category,
        search,
        currentPage,
      }),
    );

    window.scrollTo(0, 0);
  };

  /////// Если изменили параметры и был первый рендер
  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        page: currentPage,
        category: categoryId,
        sortBy: sortBy.sortProperty,
      };
      const queryString = qs.stringify(params);
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [searchValue, categoryId, currentPage, sortBy.sortProperty]);

  // Если был первый рендер, то проверяем URL-параметр navigateы и сохраняем в redux
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
      const sort = sortList.find((obj) => obj.sortProperty === sortBy.sortProperty);

      console.log(window.location.search);
      console.log(params);

      dispatch(
        setFilters({
          searchValue: searchValue,
          categoryId: Number(categoryId),
          currentPage: currentPage,
          sortBy: sort || sortList[0],
        }),
      );
      isMounted.current = true;
    }
  }, []);

  // Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    getPizzas();
  }, [searchValue, categoryId, currentPage, sortBy.sortProperty]);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(12)].map((_, i) => <Skeleton key={i} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onClickCategory} />
        <SortPopup value={sortBy} />
      </div>
      <h2 className="content__title">Усі піци</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Сталася помилка 😕</h2>
          <p>
            На жаль, не вдалося отримати піци. <br />
            Спробуйте пізніше ще раз.
          </p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};
