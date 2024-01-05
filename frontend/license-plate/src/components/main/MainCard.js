
const MainCard = ({ truckNumber, predictResult, predictId, time, setImgUrl, setPredValue, setMatchedData }) => {


    // 등록하기 버튼 클릭
    const submitClick = () => {
        // 트럭 안 골랐을 때
        if (!truckNumber) {
            alert("차량을 선택해주세요.");
            return;
        }

        const loginUser = localStorage.getItem("id");

        const data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        };

        fetch(`http://10.125.121.216:8080/api/techtri/record/work/${truckNumber[0]}/${predictId}?writer=${loginUser}`, data)
            .then(resp => {
                console.log(resp)
                if (resp.status === 200) {
                    alert("등록 완료")
                    setImgUrl();
                    setPredValue();
                    setMatchedData();
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="w-[300px]">
            <h2 className="text-lg font-bold pt-3">추론결과 및 등록</h2>
            <div className="relative mt-2 h-[320px] border-[1px] border-[#333333] ">
                <div className="text-center border-b-[1px] h-[120px] py-2">
                    <h3 className="text-base font-bold">추론결과</h3>
                    <div className="text-3xl font-bold tracking-widest mt-2">{predictResult}</div>
                    <div className="text-lg">object : truck</div>
                </div>
                <div className="text-center p-2">
                    <h3 className="text-base font-bold">작업차량 등록</h3>
                    <div className="flex-col items-center grid grid-cols-2 h-[120px] mt-1">
                        <p className="text-gray-600">선택된 차량번호</p>
                        {
                            truckNumber && truckNumber
                                ? <p><span className="">{truckNumber[1]}</span></p>
                                : <p>선택 안 함</p>
                        }
                        <p className="text-gray-600">작업 시각</p>
                        <p>{time}</p>
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
