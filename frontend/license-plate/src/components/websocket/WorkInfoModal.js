import { IoMdCloseCircleOutline } from "react-icons/io";

const WorkInfoModal = ({ setOpenModal, carId, predId, time, writer, setIsWaiting, setPredValue, setMatchedData, setIsSuccess, setSelTruck }) => {
    const handleModal = () => {
        setOpenModal(false);
    }

    const handleSubmit = () => {
        fetch(`http://10.125.121.216:8080/api/techtri/record/work/${carId[0]}/${predId}?writer=${writer}`, {
            method: 'POST',
            headers: {
                Authorization: localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
        })
            .then(resp => {
                if (resp.status === 200) {
                    alert("등록되었습니다.");
                    setIsWaiting(true);
                    setPredValue();
                    setMatchedData();
                    setIsSuccess();
                    setSelTruck();
                    setOpenModal(false);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="relative bg-white drop-shadow-lg rounded-lg w-[400px] h-[300px] p-3 px-3">
                <div className="text-center font-bold text-lg">
                    작업 등록
                    <p className="text-sm font-light text-red-500 ">등록할 내용을 확인해주세요</p>
                </div>
                <div className="grid grid-cols-2 items-center text-gray-400 h-[200px] px-6">
                    <div>선택한 차량번호</div>
                    <p className="text-black">{carId[1]}</p>
                    <div>날짜</div>
                    <p className="text-black">{time.slice(0,10)}</p>
                    <div>시간</div>
                    <p className="text-black">{time.slice(-8)}</p>
                    <div>작성자</div>
                    <p className="text-black">{writer}</p>
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

export default WorkInfoModal
