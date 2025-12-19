import { useState } from "react";
import BackToTop from "../components/BackToTop";
import Header from "../components/Header";
import Styles from "../css/FindPwId.module.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const FindPwId = () => {

    const [mode, setMode] = useState<"id" | "pw">("pw");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        // JSON 객체 만들기
        const body: any = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });

        try {
            const url = 
                mode === "pw"
                    ? "http://localhost:8080/api/password/find" // 비밀번호 찾기 API
                    : "http://localhost:8080/api/id/find"; // 아이디 찾기 API

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                credentials: "include",
            });

            if (!res.ok) throw new Error("서버 요청 실패");
            
            const data = await res.json();

            if(mode === "id"){
                alert(`가입된 아이디: ${data.data}`);
            } else {
                alert("비밀번호 재설정 메일이 발송되었습니다.");
            } 
        } catch (error) {
            console.error(error);
            alert("일치하는 정보가 없습니다.");
        }
    }
    

    return (
    <>
        <div className={Styles.pageEnvelope}>
            <div className={Styles.wrap}>
                <Header variant="auth" />

            <div className={Styles.content}>
                <div className={Styles.loginBox}>
                <div className={Styles.tabs}>
                    <button
                    className={mode === "id" ? Styles.active : ""}
                    onClick={() => setMode("id")}
                    type="button"
                    >
                    아이디 찾기
                    </button>
                    <button
                    className={mode === "pw" ? Styles.active : ""}
                    onClick={() => setMode("pw")}
                    type="button"
                    >
                    비밀번호 찾기
                    </button>
                </div>

                <form className={Styles.form} onSubmit={handleSubmit}>
                    {mode === "id" ? (
                    <div className={Styles.inputGroup}>
                        <label>이메일</label>
                        <input
                        name="email"
                        type="email"
                        placeholder="가입한 이메일 입력"
                        required
                        />
                    </div>
                    ) : (
                    <div className={Styles.inputGroup}>
                        <label>아이디</label>
                        <input
                        name="username"
                        type="text"
                        placeholder="아이디 입력"
                        required
                        />
                        <label>이메일</label>
                        <input
                        name="email"
                        type="email"
                        placeholder="가입한 이메일 입력"
                        required
                        />
                    </div>
                    )}

                    <button type="submit" className={Styles.loginBtn}>
                    {mode === "pw" ? "비밀번호 찾기" : "아이디 찾기"}
                    </button>
                </form>

                <div className={Styles.bottomLinks}>
                    <Link to="/login">로그인으로 돌아가기</Link>
                </div>
                </div>
            </div>
            </div>
        </div>

        <Footer />
        <BackToTop />
        </>
    );
}

export default FindPwId;