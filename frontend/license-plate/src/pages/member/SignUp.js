import axios from "axios"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PasswordWithIcon from "../../components/comm/PasswordWithIcon"

const SignUp = () => {
    // 회원가입 관련
    const signUpId = useRef();
    const signUpPwd = useRef();
    const pwdCheck = useRef();
    const email = useRef();

    const [isValidID, setIsValidID] = useState(false);
    const [isValidIDMsg, setIsValidIDMsg] = useState(null);
    const [isValidEmailMsg, setIsValidEmailMsg] = useState(null);

    const navigate  = useNavigate();

    // 비밀번호, 이메일 정규식
    const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;


    // 아이디 중복확인
    const idCheck = () => {
        // 입력하지 않았을 때
        if (signUpId.current.value === "") {
            alert("아이디를 입력해주세요");
            return;
        }

        // 아이디 길이 확인
        if(signUpId.current.value.length < 4 || signUpId.current.value.length > 12) {
            alert("아이디는 4~12글자로 입력해주세요.");
            signUpId.current.focus();
            return;
        }

        axios.get(`http://10.125.121.216:8080/api/public/check-id?id=${signUpId.current.value}`)
            .then(resp => {
                if(resp.status == 200){
                    setIsValidID(true);
                    setIsValidIDMsg(true);
                }
            })
            .catch(err => {
                setIsValidIDMsg(false);
            })
    }

    // 아이디 입력 부분 변경될 때 처리
    const handleIdChange = () => {
        setIsValidID(null);
        setIsValidIDMsg(null);
    }

    // 회원가입 버튼 클릭
    const submitSignUp = () => {

        // 아이디 중복확인 여부
        if (!isValidID) {
            alert("아이디 중복확인을 완료해주세요.");
            return;
        }

        // 비밀번호, 비밀번호 확인이 서로 다를 때
        if (signUpPwd.current.value != pwdCheck.current.value) {
            alert("비밀번호를 확인해주세요");
            pwdCheck.current.focus();
            return;
        }

        // 비밀번호 형식 테스트
        if(!(passwordRegEx.test(signUpPwd.current.value))){
            alert("비밀번호는 문자, 숫자, 특수기호가 포함되어야 합니다.\n(8자 이상 15자 이하)");
            return;
        }

        // 아이디, 비밀번호, 이메일이 없을 때
        if (signUpId.current.value === "" || signUpPwd.current.value === "" || email.current.value === "") {
            alert("모든 항목을 입력해주세요");
            return;
        }


        // 이메일 형식 테스트
        if(!(emailRegEx.test(email.current.value))){
            setIsValidEmailMsg("올바르지 않은 이메일 형식입니다.");
            return;
        } else {
            setIsValidEmailMsg("");
        }

        const signUpData = {
            id: signUpId.current.value,
            password: signUpPwd.current.value,
            email: email.current.value
        };

        axios.post("http://10.125.121.216:8080/api/public/signup", signUpData)
            .then(resp => {
                if(resp.status == 200){
                    alert("회원가입이 완료되었습니다.\n로그인 페이지로 돌아갑니다.");
                    navigate("/");
                }
            })
            .catch(err => {
                alert("회원가입 실패\n다시 시도해주세요.");
            })
    }

    return (
        <div className="flex justify-center grow h-full bg-[url(./images/background_img.jpg)] bg-center bg-cover">
            <div className="flex justify-center bg-white w-[500px] h-[700px] m-auto md:w-[768px] lg:w-[800px] lg:h-full">
                <div className="w-full h-full md:w-[500px] md:h-[700px] m-auto p-5">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mt-[1rem]">SIGN UP</h1>
                    <div className="mt-[3rem]">
                        <div className="flex flex-col">
                            <div className="flex justify-start items-center">
                                <label htmlFor="id" className="font-bold md:text-lg">ID</label>
                                {
                                    isValidIDMsg === null
                                    ? ""
                                    : isValidIDMsg
                                    ? <p className="text-sm text-green-500 ml-2">사용 가능한 아이디입니다.</p>
                                    : <p className="text-sm text-red-500 ml-2">이미 존재하는 아이디입니다.</p>
                                }
                            </div>
                            <div className="flex gap-3">
                                <input type="text"
                                    id="signUpId"
                                    ref={signUpId}
                                    onChange={handleIdChange}
                                    placeholder="아이디를 입력해주세요 (4~12자)"
                                    className="bg-[#F3F3F3] rounded-[10px] border-[#2E3D4E] focus:border-[#2E3D4E] focus:ring-[#2E3D4E] w-[75%] h-[50px]" />
                                <button
                                    onClick={idCheck}
                                    className="bg-[#AAE5F8] rounded-[10px] text-white font-bold text-lg w-[25%]">중복확인</button>
                            </div>
                        </div>
                        <div className="flex flex-col mt-[1.25rem]">
                            <label htmlFor="signUpPwd" className="font-bold md:text-lg">PASSWORD</label>
                            <PasswordWithIcon inputId="signUpPwd" refs={signUpPwd}/>
                        </div>
                        <div className="flex flex-col mt-[1.25rem]">
                            <label htmlFor="pwdCheck" className="font-bold md:text-lg">CONFIRM PASSWORD</label>
                            <PasswordWithIcon inputId="pwdCheck" refs={pwdCheck}/>
                        </div>
                        <div className="flex flex-col mt-[1.25rem]">
                            <div className="flex items-center">
                                <label htmlFor="signUpEmail" className="font-bold md:text-lg">EMAIL</label>
                                {
                                    isValidEmailMsg === null
                                    ? ""
                                    : <p className="text-sm text-red-500 ml-2">{isValidEmailMsg}</p>
                                }
                            </div>
                            <input type="email"
                                id="signUpEmail"
                                ref={email}
                                placeholder="abc@email.com"
                                className="bg-[#F3F3F3] rounded-[10px] border-[#2E3D4E] focus:border-[#2E3D4E] focus:ring-[#2E3D4E] h-[50px]" />
                        </div>
                        <div className="w-full h-[50px] mt-[2.5rem]">
                            <button
                                onClick={submitSignUp}
                                className="bg-[#2E3D4E] text-lg font-bold text-white rounded-[10px] w-full h-full">SIGN UP</button>
                        </div>
                        <p className="text-center underline text-[#6B6F75] mt-[1rem]"><Link to='/'>로그인</Link></p>
                    </div>
                </div>
            </div>
            <div className="bottom-3 fixed text-white md:text-[#2E3D4E] text-lg">@TechTri</div>
        </div>
    )
}

export default SignUp
