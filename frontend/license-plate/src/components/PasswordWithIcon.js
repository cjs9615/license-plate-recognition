import { useState } from "react";
import { FaEye, FaEyeSlash  } from "react-icons/fa";

const PasswordWithIcon = ({inputId, refs}) => {
    // 비밀번호 보기 아이콘 클릭 여부
    const [isClicked, setIsClicked] = useState(false);
    const [inputType, setInputType] = useState("password");

    const iconClick = (e) => {
        e.preventDefault();

        if(isClicked){
            setInputType("password");
            setIsClicked(false);
        } else {
            setInputType("text");
            setIsClicked(true);
        }
    }
    return (
        <div className="relative">
            <input 
                type={inputType}
                id={inputId}
                ref={refs}
                placeholder="문자, 숫자, 특수기호 포함 (8~15자)"
                className="bg-[#F3F3F3] rounded-[10px] border-[#2E3D4E] focus:border-[#2E3D4E] focus:ring-[#2E3D4E] w-full h-[50px]" 
            />
            <div onClick={iconClick} className="absolute right-0 top-0 mt-3 mr-4">
                {
                    isClicked
                    ? <FaEye className="text-2xl"/>
                    : <FaEyeSlash className="text-2xl text-gray-500"/>
                }
            </div>
        </div>
    )
}

export default PasswordWithIcon
