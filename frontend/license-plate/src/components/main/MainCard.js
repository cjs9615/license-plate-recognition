import { useRef } from "react";

const MainCard = ({ resultTime, truckNumber, predictId }) => {
    // 입출차 유형
    const entryType = useRef();

    // 등록하기 버튼 클릭
    const submitClick = () => {
        // 트럭 안 골랐을 때
        if (!truckNumber) {
            alert("차량을 선택해주세요.");
            return;
        }

        const regiData = {
            carId: truckNumber[0],
            predictId: predictId,
            status: entryType.current.value,
            time: "2023-12-30 14:46:22",
            writer: localStorage.getItem("id"),
        }

        console.log(regiData);
    }

    return (
        <div className="w-[300px]">
            <h2 className="text-lg font-bold pt-3">추론결과 및 등록</h2>
            <div className="relative mt-2 h-[320px] border-[1px] border-[#333333] ">
                <div className="text-center border-b-[1px] h-[110px] py-2">
                    {/* <h3 className="text-sm text-gray-500">결과</h3> */}
                    <div className="text-3xl font-bold tracking-widest mt-3">1234</div>
                    <div className="text-lg">object : truck</div>
                </div>
                <div className="text-center p-2">
                    <h3 className="text-base font-bold">입출차 등록</h3>
                    <div className="flex-col items-center grid grid-cols-2 h-[130px] mt-1">
                        <p className="text-gray-600">선택된 차량번호</p>
                        {
                            truckNumber && truckNumber
                                ? <p><span className="">{truckNumber[1]}</span></p>
                                : <p>선택 안 함</p>
                        }

                        <p className="text-gray-600">입출차 유형</p>
                        <div>
                            <select ref={entryType} className="w-[100px] h-[30px] p-0 px-2">
                                <option>입차</option>
                                <option>출차</option>
                            </select>
                        </div>
                        <p className="text-gray-600">분석 시각</p>
                        <p>2023-12-30 14:46:22</p>
                        {/* <p>{resultTime}</p> */}
                    </div>
                </div>
                <div
                    onClick={submitClick}
                    className="absolute transition-all bottom-0 flex justify-center items-center bg-[#1D647A] active:bg-[#103c49] text-white w-full h-[40px] cursor-pointer">
                    등록하기
                </div>
            </div>
        </div>
    )
}

export default MainCard
