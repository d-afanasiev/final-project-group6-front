import { React, useState } from 'react';
import css from './Statistics.module.css';
import ButtonChangeCategories from '../ButtonChangeCategories';

export default function Statistics({ month, year }) {
  const [costs, setCosts] = useState(false);
  const changeStatus = () => {
    if (!costs) {
      setCosts(true);
    }
    if (costs) {
      setCosts(false);
    }
  };

  return (
    <>
      <div className={css.containerButton}>
        <ButtonChangeCategories costs={costs} changeStatus={changeStatus} />
        {/* <CategoryImage costs={costs} month={month} year={year}/> - тут должен быть компонент с категориями  */}
      </div>
      <div className={css.containerGraph}>
        {/* <Graph costs={costs} month={month} year={year}/> - тут должны быть графики для описаний */}
      </div>
    </>
  );
}
