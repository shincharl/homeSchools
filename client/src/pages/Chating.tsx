import ChatRoom from "../components/ChatRoom";
import Styles from "../css/Chating.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

interface ChatingProps {
    socket: any;
}

const Chating = ({socket}: ChatingProps) => {
    return (
        <>
                <div className={Styles.pageEnvelope}>
                    <div className={Styles.wrap}>
                        <Header/>
                        <div className={Styles.content}>
                            <ChatRoom socket={socket}/>
                        </div>
                    </div>
                </div>

                <Footer/>
                <BackToTop/>
        </>
    );
}

export default Chating;