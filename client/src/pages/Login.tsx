import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContextType';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Styles from '../css/Login.module.css'

const Login = () => {

    const { setIsLoggedIn, setNickname } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const body = new URLSearchParams();
        body.append("username", formData.get("username") as string);
        body.append("password", formData.get("password") as string);

        try {
            const res = await fetch("https://gwi-homeschool-8c27de57ef07.herokuapp.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
                credentials: "include",
            });

            if(!res.ok) {
                alert("로그인 실패");
                return;
            }

                const data = await res.json();
                console.log("USER:", data);

                // AuthContext 상태 업데이트
                setIsLoggedIn(true);
                setNickname(data.nickname);

                // localStorage도 저장 (새로고침 대비)
                localStorage.setItem("nickname", data.nickname);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("accessToken", data.token);


                if (data.tempPassword) {
                    navigate("/changepassword", {replace: true});
                } else {
                    navigate("/", {replace: true});
                }


        } catch (error) {
            console.error("ERROR:", error);
            alert("로그인 중 오류 발생");
        }

    }

    const kakaoLogin = () => {
        window.location.href = "https://gwi-homeschool-8c27de57ef07.herokuapp.com/api/oauth2/authorize/kakao/start";
    };

    const naverLogin = () => {
        window.location.href = "https://gwi-homeschool-8c27de57ef07.herokuapp.com/api/oauth2/authorize/naver/start";
    };

    return (
        <>
            <div className={Styles.pageEnvelope}>
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        {/* 로그인 창!!! */}
                        <div className={Styles.loginBox}>
                            <h2>로그인</h2>

                            <form className={Styles.form} onSubmit={handleLogin}>
                                <div className={Styles.inputGroup}>
                                    <label>아이디</label>
                                    <input name="username" type="text" placeholder="아이디를 입력하세요" required/>
                                </div>

                                <div className={Styles.inputGroup}>
                                    <label>비밀번호</label>
                                    <input name="password" type="password" placeholder="비밀번호를 입력하세요" required/>
                                </div>

                                <button type="button" onClick={kakaoLogin} className={Styles.kakaoBtn}>카카오 로그인</button>
                                <button type="button" onClick={naverLogin} className={Styles.naverBtn}>네이버 로그인</button>

                                <button className={Styles.loginBtn} type="submit">로컬 로그인</button>

                                <div className={Styles.bottomLinks}>
                                    <Link to="/register">회원가입</Link>
                                    <Link to="/findpwid">아이디/비밀번호 찾기</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
            <BackToTop/>
        </>
    );
}

export default Login;