import { useNavigate } from "react-router-dom";
import Styles from "../css/ChangePassword.module.css";
import { useState } from "react";

const ChangePassword = () => {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if(password !== confirmPassword) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }

            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]).{8,}$/;

            if (!passwordRegex.test(password)){
                alert("비밀번호는 8자 이상이며 숫자와 특수문자를 각각 1개 이상 포함해야 합니다.");
                return;
            }

            setLoading(true);

            try {
                const res = await fetch("http://localhost:8080/api/password/change", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({ password }),
                });
                
                if(!res.ok) throw new Error("비밀번호 변경 실패");

                alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");

                // 로그아웃 처리
                localStorage.clear();
                navigate("/login", {replace: true});

            } catch (error) {
                alert("비밀번호 변경 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }

    }

    return (
        <>
            <div className={Styles.overlay}>
                <div className={Styles.modal}>
                    <h2 className={Styles.title}>비밀번호 변경</h2>

                    <p className={Styles.desc}>
                        임시 비밀번호로 로그인하셨습니다. <br />
                        보안을 위해 비밀번호를 변경해주세요.
                    </p>

                    <form className={Styles.form} onSubmit={handleSubmit}>
                        <input 
                            type="password"
                            placeholder="새 비밀번호 (8자 이상, 숫자·특수문자 포함)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />

                        <input
                            type="password"
                            placeholder="새 비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "변경 중..." : "비밀번호 변경"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
