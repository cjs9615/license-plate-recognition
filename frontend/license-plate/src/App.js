import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { RecoilRoot } from 'recoil';
import Login from './pages/member/Login';
import SignUp from './pages/member/SignUp';
import Main from './pages/main/Main';

function App() {
  return (
    <BrowserRouter>
      <main className='flex flex-col h-screen'>
        <RecoilRoot>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/signUp' element={<SignUp />}></Route>
            <Route path='/main' element={<Main />}></Route>
          </Routes>
        </RecoilRoot>
      </main>
    </BrowserRouter>
  );
}

export default App;
