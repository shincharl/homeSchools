import { Navigate } from "react-router-dom";

interface IntoChatingProps {
    children: JSX.Element;
    isLoggedIn: boolean;
}

const IntoChating = ({ children, isLoggedIn} : IntoChatingProps) => {
    if(!isLoggedIn) {
        alert("로그인 후 이용 가능합니다.");
        return <Navigate to="/login" replace />
    }

    return children;
}

export default IntoChating;