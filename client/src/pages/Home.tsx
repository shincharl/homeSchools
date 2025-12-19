import { Link, useNavigate } from "react-router-dom";
import BackToTop from "../components/BackToTop";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Introduce from "../components/Introduce";
import Service from "../components/Service";
import Styles from "../css/Home.module.css";
import { useAuth } from "../components/AuthContextType";

const Home = () => {
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    const handleStartClick = (e: React.MouseEvent) => {
        if(!isLoggedIn){
            e.preventDefault();
            alert("로그인 후 이용 가능합니다.");
            navigate("/login");
        }
    }

    return(
        <>
        <div className={Styles.pageEnvelope}> {/* 바깥 배경 */}
            <div className={Styles.wrap}>
                <Header/>
                    <div className={Styles.content}>
                        <h1> GWI가 제공하는 웹 1:1 과외 서비스! <br/> 해당 서비스를 이용해보세요!</h1>
                        <br/>
                        <p> 로그인 후 이용이 가능합니다.</p>

                        <div>
                            <Link to="/chating" className={Styles.Start} onClick={handleStartClick}>Get started</Link>
                        </div>
                            
                            <div className={Styles.images}>
                                <img className={Styles.teach1} src="/image/teach1.jpg" alt="teach1" />
                                <img className={Styles.teach2} src="/image/teach2.jpg" alt="teach2" />
                            </div>
                            <Introduce id="about"/>
                            <Service id="service"/>
                    </div>
                </div>
            </div>
            <Footer/>
            <BackToTop/>
        </>
    );
}

export default Home;