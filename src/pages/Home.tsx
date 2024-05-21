import React from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Categories, SortPopup, PizzaBlock, Skeleton, Pagination } from '../components';
import { sortList } from '../components/SortPopup';

import { useAppDispatch } from '../redux/store';

import { fetchPizzas } from '../redux/pizza/asyncActions';
import { selectPizzaData } from '../redux/pizza/selectors';
import { SearchPizzaParams } from '../redux/pizza/types';
import { setCategory, setCurrentPage, setFilters } from '../redux/filter/slice';
import { selectFilter } from '../redux/filter/selectors';
import { SortPropertyEnum } from '../redux/filter/types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = React.useRef(false);

  const { items, status } = useSelector(selectPizzaData);
  const { searchValue, categoryId, currentPage, sortBy } = useSelector(selectFilter);

  const onClickCategory = React.useCallback((idx: number) => {
    dispatch(setCategory(idx));
    dispatch(setCurrentPage(1));
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

  // Якщо змінили параметри і був перший рендер
  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        currentPage,
        categoryId,
        sort: sortBy.sortProperty,
      };
      const queryString = qs.stringify(params);
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [searchValue, categoryId, currentPage, sortBy.sortProperty]);

  // Якщо був перший рендер, то перевіряємо URL-параметр navigate та зберігаємо у redux
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
      const sortObj = sortList.find((obj) => obj.sortProperty === sortBy.sortProperty);

      dispatch(
        setFilters({
          searchValue: params.search,
          categoryId: Number(params.categoryId),
          currentPage: params.currentPage,
          sortBy: sortObj || sortList[0],
        }),
      );
      isMounted.current = true;
    }
  }, []);

  // Якщо був перший рендер, то заватнажуємо піци
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

export default Home;
