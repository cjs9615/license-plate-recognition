import SideBar from "../../components/comm/SideBar"
import { useEffect, useRef, useState } from "react"
import InfoCard from "../../components/websocket/InfoCard";
import NumberResult from "../../components/websocket/NumberResult";
import WebSocketImage from "../../components/websocket/WebSocketImage";
import { GiCctvCamera } from "react-icons/gi";
import { FaTruck } from "react-icons/fa6";
import { LuRectangleHorizontal } from "react-icons/lu";
import ResultTable from "../../components/websocket/ResultTable";

const WebSocketMain = () => {
    const webSocket = useRef(null);

    // Input
    const [imgUrl, setImgUrl] = useState();

    // Result
    const [predValue, setPredValue] = useState();
    const [progressStatus, setProgressStatus] = useState(false);
    const [matchedData, setMatchedData] = useState();

    useEffect(() => {
        console.log("결과 데이터 리스트 : ", matchedData)
    }, [matchedData])

    useEffect(() => {
        webSocket.current = new WebSocket("ws://10.125.121.216:8080/pushservice");
        webSocket.current.onopen = () => {
            console.log("WebSocket 연결");
        }

        webSocket.current.onmessage = (event) => {
            // console.log("이벤트 : ", JSON.parse(event.data));
            if (JSON.parse(event.data).type === "pre-prediction") {
                // 이전 결과값 초기화
                // 전체 사진 설정
                // 데이터 분석 진행중 시작
                // setPredValue();
                // setMatchedData();
                // setImgUrl(JSON.parse(event.data).url)
                // setProgressStatus(true);
            } else {
                // setProgressStatus(false);
                // setPredValue(JSON.parse(event.data).predictResult);
                // setMatchedData(JSON.parse(event.data).predictResult.numberList)
                // console.log("DB 데이터 : ", JSON.parse(event.data).predictResult.numberList);
                // console.log("결과데이터 : ", JSON.parse(event.data).predictResult)
            }
        };
    }, [])

    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem] mb-[1rem] md:mb-0">
                <div className="items-center border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">MONITORING</h1>
                </div>
                {/* 안내 메시지 */}
                <div className=" text-xl text-[#474E58] font-bold mt-[1rem]">
                    고철장 내 차량을 감지하고 있습니다.<br />
                    {/* 고철장 내 <span className="text-[#ff9a3c] font-bold">작업 차량</span>이 감지되었습니다.<br/> */}
                    {/* 작업차량 번호판 추출에 <span className="text-[#54acff] font-bold">성공</span>하였습니다.<br /> */}
                    {/* 작업차량 번호판 추출에 <span className="text-[#ff5050] font-bold">실패</span>하였습니다.<br /> */}
                </div>
                {/* 결과 표 - 항상표시 */}
                <div className="flex flex-col lg:flex-row gap-4 mt-[1rem]">
                    <InfoCard />
                    <NumberResult text="RESULT" textColor="text-gray-300" />
                </div>
                {/* 이미지, 테이블 */}
                <div className=" flex flex-col lg:flex-row justify-between gap-4 mt-[1rem]">
                    <div className=" w-full">
                        <div className="mb-[1rem]">
                            <WebSocketImage
                                title="인식된 차량 이미지"
                                mdH="md:h-[300px]"
                                icon={<GiCctvCamera />}
                                msg="차량 인식 단말기에서 감지된 이미지를 표시합니다" />
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between gap-3">
                            <div className="w-full">
                                <WebSocketImage
                                    title="차량 추출"
                                    mdH="md:h-[200px]"
                                    icon={<FaTruck />}
                                    msg="차량 객체를 추출하여 표시합니다" />
                            </div>
                            <div className=" w-full">
                                <WebSocketImage
                                    title="번호판 추출"
                                    mdH="md:h-[200px]"
                                    icon={<LuRectangleHorizontal />}
                                    msg="번호판을 추출하여 표시합니다" />
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <ResultTable />
                    </div>
                </div>
                {/* 결과 등록 버튼 */}
                <div className="flex justify-end mt-[1rem]">
                    <div className=" transition-all bg-[#008E93] hover:bg-[#103c49] text-white rounded-md p-2 px-4 cursor-pointer">
                        등록하기
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WebSocketMain;