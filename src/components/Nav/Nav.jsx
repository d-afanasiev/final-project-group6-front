import { useDispatch } from "react-redux";
import { authOperations } from "../../redux/auth";
import Modal from '../Modal/Modal';
import useModal from '../Modal/useModal';
import css from './Nav.module.css';
import sprite from '../../images/svg/sprite.svg';
import { options } from '../../db';

function Nav() {
  const { userName, avatarUrl } = options;
  const { isShowingModal, toggle } = useModal();
  const dispatch = useDispatch();

  return (
    <nav className={css.nav}>
      <div className={css.user}>
        <img className={css.userAvatar} src={avatarUrl} alt="user avatar" />
        <span className={css.userName}>{userName}</span>
      </div>
      <svg className={css.line} width='2' height='36'>
        <use href={`${sprite}#icon-line`}></use>
      </svg>
      <div className={css.exit}>
        <svg className={css.exitIcon} onClick={() => toggle()} width='16' height='16'>
          <use href={`${sprite}#icon-logout`}></use>
        </svg>
        <span className={css.exitLink} onClick={() => toggle()}>
          Выйти
        </span>
        {isShowingModal && (
          <Modal
            text={'Вы действительно хотите выйти?'}
            toLogout={() => dispatch(authOperations.logOut())}
            onClose={toggle}
          />
        )}
      </div>
    </nav>
  );
}

export default Nav;
