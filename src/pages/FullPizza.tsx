import React from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const FullPizza: React.FC = () => {
  const [pizza, setPizza] = React.useState<{
    imageUrl: string;
    name: string;
    price: number;
  }>();

  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          'https://63f10fb05b7cf4107e2c64b7.mockapi.io/items/' + id,
        );
        setPizza(data);
      } catch (error) {
        console.log('Помилка загрузки!');
        navigate('/');
      }
    }
    fetchPizza();
  }, []);

  if (!pizza) {
    return <Loading />;
  }

  return (
    <div className="container">
      <img className="pizza-block__image" src={pizza.imageUrl} alt="Pizza" />
      <h4 className="pizza-block__title">{pizza.name}</h4>
      <div className="pizza-block__price">Ціна від {pizza.price} ₴</div>
      <br />
      <Link to="/">
        <button className="button button--outline button--add">
          <span>Назад</span>
        </button>
      </Link>
    </div>
  );
};

export default FullPizza;
