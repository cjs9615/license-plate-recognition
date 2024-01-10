import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { RecoilRoot } from 'recoil';
import Login from './pages/member/Login';
import SignUp from './pages/member/SignUp';
import Main from './pages/main/Main';
import Search from './pages/main/Search';
import Admin from './pages/main/Admin';
import WebSocketMain from './pages/main/WebSocketMain';
import AccessDeniedPage from './pages/main/AccessDeniedPage';

function App() {
  return (
    <BrowserRouter>
      <main className='flex flex-col h-screen'>
        <RecoilRoot>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/signUp' element={<SignUp />}></Route>
            <Route path='/main' element={<WebSocketMain />}></Route>
            <Route path='/test' element={<Main />}></Route>
            <Route path='/search' element={<Search />}></Route>
            <Route path='/admin' element={<Admin />}></Route>
            <Route path='/unauthorized' element={<AccessDeniedPage />}></Route>
          </Routes>
        </RecoilRoot>
      </main>
    </BrowserRouter>
  );
}

export default App;
