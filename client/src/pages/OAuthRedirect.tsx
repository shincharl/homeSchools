import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContextType";

interface JwtPayload {
  sub: string;
  provider: string;
  nickname?: string;
  iat?: number;
  exp?: number;
}

// JWT 디코딩 함수 (Base64Url 디코딩)
function decodeJWT(token: string): JwtPayload {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(
      decoded.split("").map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join("")
    ));
  } catch (err) {
    throw new Error("Invalid JWT");
  }
}

const OAuthRedirect = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setNickname, resetTimer } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawToken = params.get("token");

    if (!rawToken) {
      navigate("/login?error=oauth_failed", { replace: true });
      return;
    }

    const token = decodeURIComponent(rawToken);
    localStorage.setItem("accessToken", token);

    try {
      const decoded: JwtPayload = decodeJWT(token);

      if (decoded.nickname) setNickname(decoded.nickname);
      setIsLoggedIn(true);
      resetTimer();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("JWT 디코딩 실패", error);
      navigate("/login?error=invalid_token", { replace: true });
    }
  }, [navigate, setIsLoggedIn, setNickname, resetTimer]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthRedirect;
