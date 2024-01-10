import { useEffect, useState } from "react"
import SideBar from "../../components/comm/SideBar"
import { useNavigate } from "react-router-dom"
import { BiError } from "react-icons/bi";

const AccessDeniedPage = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(3);

    useEffect(()=>{
        setInterval(()=>{
            setCount((count - 1))
        }, 1000);

        if(count === 0){
            navigate("/main");
        }
    },[count])

    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="h-full flex flex-col items-center justify-center">
                    <BiError className="text-7xl text-gray-300"/>
                    <h1 className="font-bold text-2xl mt-[1rem]">접근이 거부되었습니다</h1>
                    <p className="text-gray-400 mt-[1rem]">이 페이지에 접근할 권한이 없습니다.</p>
                    <p className="text-gray-400">도움이 필요하면 시스템 관리자에게 문의하십시오.</p>
                    <p className="mt-[1rem]">{count}초 후 메인으로 이동합니다</p>
                </div>
            </div>
        </div>
    )
}

export default AccessDeniedPage
