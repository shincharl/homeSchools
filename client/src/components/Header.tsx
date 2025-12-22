import Styles from '../css/Header.module.css';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from './AuthContextType';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const { nickname, handleLogout, timeLeft, resetTimer, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleStartClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
    }
  };

  return (
    <header className={Styles.wrap}>
      <div className={Styles.logo}>
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><h2>화상 통화 서비스</h2></Link>
        <div className={Styles.hamburger} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <nav className={`${Styles.menu_container} ${menuOpen ? Styles.active : ""}`}>
        {/* 왼쪽 메뉴 */}
        <ul className={Styles.menu}>
          <li><HashLink smooth to="/#about"><span>About</span>소개</HashLink></li>
          <li><HashLink smooth to="/#service"><span>Service</span>서비스</HashLink></li>
          <li><HashLink smooth to="/contacts"><span>Contact</span>문의</HashLink></li>
        </ul>

        {/* 오른쪽 사용자 영역 */}
        <ul className={Styles.user_actions}>
          {nickname ? (
            <>
              <li className={Styles.user} onClick={resetTimer}>
                {nickname} 님 🌱
                <span className={Styles.timer}>
                  ({minutes}:{seconds.toString().padStart(2, '0')})
                </span>
              </li>
              <li className={Styles.logout}>
                <button onClick={handleLogout}>Logout</button>
              </li>
              <li className={Styles.Start}>
                <Link to="/chating">Get started</Link>
              </li>
            </>
          ) : (
            <>
              <li className={Styles.login}><Link to="/login">Login</Link></li>
              <li className={Styles.Start}>
                <Link to="/chating" onClick={handleStartClick}>Get started</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
