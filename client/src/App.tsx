import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Chating from './pages/Chating';
import Contacts from './pages/Contacts';
import ContactNew from './pages/ContactNew';
import ContactDetail from './pages/ContactDetail';
import Login from './pages/Login';
import PrivateRoute from './components/privateRoute';
import Register from './pages/Register';
import EditContact from './pages/EditContact';
import OAuthRedirect from './pages/OAuthRedirect';
import IntoChating from './components/IntoChating';
import { useAuth } from './components/AuthContextType';
import WebRTCProvider from './providers/WebRTCProvider';
import { io } from 'socket.io-client';
import FindPwId from './pages/FindPwId';
import ChangePassword from './pages/ChangePassword';

function App() { 

 const socket = useMemo(() => io("https://homeschoolswebrtcserver-production.up.railway.app"), []); // App 최초 렌더링 시 한 번만

  const { isLoggedIn } = useAuth(); // 로그인 상태 

  return (
    <WebRTCProvider socket={socket}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/contacts' element={<Contacts/>}/>
          <Route 
            path='/contact/new'
            element={
              <PrivateRoute>
                <ContactNew />
              </PrivateRoute>
            }
          />
          <Route path='/contact/:id' element={<ContactDetail/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/changepassword' 
            element={
              <PrivateRoute>
                  <ChangePassword/>
              </PrivateRoute>
            }
            />
          <Route path="/contact/edit/:id" element={<EditContact/>}/>
          <Route path="/oauth/redirect" element={<OAuthRedirect/>}/>
          <Route path='/chating' element={
            <IntoChating isLoggedIn={isLoggedIn}>
              <Chating socket={socket} />
            </IntoChating>
          }/>
          <Route path='/findpwid' element={<FindPwId/>}/>
        </Routes>
      </WebRTCProvider>
  )
}

export default App;
