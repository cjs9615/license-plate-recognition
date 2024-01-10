import axios from "axios"
import { useRecoilState } from "recoil"
import { LoginStateAtom } from "./LoginStateAtom";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoBlack from "../../images/logo_black.png";
import dysntLogo from "../../images/dysntLogo.jpg";

const Login = () => {

    // 로그인 상태 변수
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginStateAtom);

    // ref 변수
    const loginId = useRef();
    const loginPwd = useRef();

    const navigate = useNavigate();

    // 로그인 버튼 클릭
    const handleLogin = (e) => {
        e.preventDefault();

        if (loginId.current.value == "" || loginPwd.current.value == "") {
            alert("아이디/비밀번호를 입력해주세요.");
            return;
        }

        // 아이디, 비밀번호 전부 있을 때
        const loginData = {
            id: loginId.current.value,
            password: loginPwd.current.value
        }

        axios.post("http://10.125.121.216:8080/login", loginData)
            .then((resp) => {
                localStorage.setItem("token", resp.headers.get("Authorization"));
                localStorage.setItem("id", loginId.current.value);
                setIsLoggedIn(true);
                navigate("/main");
            })
            .catch(err => {
                alert("아이디 또는 비밀번호가 틀렸습니다.");
                console.log(err);
            })

    }

    // 엔터키 이벤트 처리
    const enterKeyDown = (e) => {
        if (e.key == "Enter") {
            handleLogin(e);
        }
    }

    useEffect(() => {
        loginId.current.focus();
    }, [])

    return (
        <div className="flex justify-center grow h-full bg-[url(./images/background_img.jpg)] bg-center bg-cover">
            <div className="relative flex justify-center bg-white w-[500px] h-[500px] m-auto md:w-[650px] md:h-[600px] md:rounded-lg">
                <div className="absolute hidden md:flex md:justify-center md:gap-5 w-[20%] bottom-[2rem] p-2">
                    <img src={logoBlack} />
                    <img src={dysntLogo} />
                </div>
                
                <div className="w-full h-full md:w-[500px] md:mt-[3rem] m-auto p-5">
                    <h1 className="text-3xl font-bold text-center mt-[1rem] lg:mt-0">LOGIN</h1>
                    <div className="mt-[3rem]">
                        <div className="flex flex-col">
                            <label htmlFor="id" className="font-bold text-lg">ID</label>
                            <input type="text"
                                id="id"
                                ref={loginId}
                                onKeyDown={enterKeyDown}
                                placeholder="아이디를 입력해주세요"
                                className="bg-[#F3F3F3] rounded-[10px] border-[#2E3D4E] focus:border-[#2E3D4E] focus:ring-[#2E3D4E] h-[50px]" />
                        </div>
                        <div className="flex flex-col mt-[1.25rem]">
                            <label htmlFor="pwd" className="font-bold text-lg">PASSWORD</label>
                            <input type="password"
                                id="pwd"
                                ref={loginPwd}
                                onKeyDown={enterKeyDown}
                                placeholder="비밀번호를 입력해주세요"
                                className="bg-[#F3F3F3] rounded-[10px] border-[#2E3D4E] focus:border-[#2E3D4E] focus:ring-[#2E3D4E] h-[50px]" />
                        </div>
                        <div className="w-full h-[50px] mt-[2.5rem]">
                            <button onClick={handleLogin} className="bg-[#2E3D4E] text-lg font-bold text-white rounded-[10px] w-full h-full">LOGIN</button>
                        </div>
                        <p className="text-center underline text-[#6B6F75] mt-[1rem]"><Link to='/signUp'>회원가입</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;