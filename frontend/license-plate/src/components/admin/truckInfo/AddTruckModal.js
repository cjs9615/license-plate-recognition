import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaTruckMoving } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { FaRegDotCircle } from "react-icons/fa";
import { useRef } from "react";

const AddTruckModal = ({ setAddModalOpen }) => {
    // 오늘 날짜 가져오기
    function getToday(){
        var date = new Date();
        var year = date.getFullYear();
        var month = ("0" + (1 + date.getMonth())).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
    
        return year + "-" + month + "-" + day;
    }
    
    const numberPlateInputRef = useRef()

    // 차량 등록하기
    const handleSubmit = () => {
        if(numberPlateInputRef.current.value === "") {
            alert("차량번호를 입력해주세요.");
            numberPlateInputRef.current.focus();
            return;
        }

        // setAddModalOpen(false);
        // alert("차량이 등록되었습니다.")
        // window.location.replace("/admin");
        console.log(numberPlateInputRef.current.value);
        console.log(getToday());

    }

    const handleModal = () => {
        setAddModalOpen(false);
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="relative bg-white drop-shadow-lg rounded-lg w-[400px] h-[250px] p-3 px-3">
                <div className="flex justify-center">
                    <h1 className="text-xl font-bold">신규 차량 등록</h1>
                </div>
                <div className="grid grid-cols-2 items-center mt-[0.5rem] h-[160px] px-5">
                    <div className="flex items-center gap-2">
                        <FaTruckMoving className="text-gray-600" />
                        <h2>차량번호</h2>
                    </div>
                    <input
                        type="text"
                        placeholder="차량번호 입력"
                        ref={numberPlateInputRef}
                        className="border-none bg-[#EDEDED] h-[38px] focus:ring-[#2E3D4E]" />

                    <div className="flex items-center gap-2">
                        <MdDateRange className="text-gray-600" />
                        <h2>등록날짜</h2>
                    </div>
                    <p>{getToday()}</p>

                    <div className="flex items-center gap-2">
                        <FaRegDotCircle className="text-gray-600" />
                        <h2>Status</h2>
                    </div>
                    <p className="text-green-700 font-bold">Active</p>
                </div>
                <div className=" absolute top-0 right-0 p-2 px-3">
                    <button onClick={handleModal}>
                        <IoMdCloseCircleOutline className="text-3xl" />
                    </button>
                </div>
                <div
                    onClick={handleSubmit}
                    className="absolute transition-all flex justify-center items-center bg-gray-600 active:bg-[#2E3D4E] text-white font-bold bottom-0 left-0 rounded-b-lg w-full h-[40px] cursor-pointer">
                    등록하기
                </div>
            </div>
        </div>
    )
}

export default AddTruckModal
