import SideBar from "../../components/comm/SideBar"
import { useEffect, useRef, useState } from "react"
import InfoCard from "../../components/websocket/InfoCard";
import Title from "../../components/websocket/Title";

import NumberResult from "../../components/websocket/NumberResult";
import ResultTable from "../../components/websocket/ResultTable";
import ResultImage from "../../components/websocket/ResultImage";
import Loading from "../../components/websocket/Loading";
import IconMsgBox from "../../components/websocket/IconMsgBox";
import WorkInfoModal from "../../components/websocket/WorkInfoModal";

import { GiCctvCamera } from "react-icons/gi";
import { FaTruck } from "react-icons/fa6";
import { LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineSmsFailed } from "react-icons/md";
import { AiFillDatabase } from "react-icons/ai";

const WebSocketMain = () => {
    const webSocket = useRef(null);
    const loginUser = localStorage.getItem("id");

    // Input
    const [imgUrl, setImgUrl] = useState();

    // Result
    const [isWaiting, setIsWaiting] = useState(true);
    const [predValue, setPredValue] = useState();
    const [progressStatus, setProgressStatus] = useState();
    const [matchedData, setMatchedData] = useState([]);
    const [isSuccess, setIsSuccess] = useState();

    // 작업 등록
    const [selTruck, setSelTruck] = useState();
    const [openModal, setOpenModal] = useState(false);

    // 작업 등록을 위한 모달 열기
    const handleModal = () => {
        if (!selTruck) {
            alert("차량번호를 선택해주세요");
            return;
        }

        setOpenModal(true);
    }

    // 실패했을 때 리셋
    const handleReset = () => {
        setIsWaiting(true);
        setPredValue();
        setMatchedData();
        setIsSuccess();
        setSelTruck();
        setImgUrl();
    }

    useEffect(() => {
        webSocket.current = new WebSocket("ws://10.125.121.216:8080/pushservice");
        webSocket.current.onopen = () => {
            console.log("WebSocket 연결");
        }

        webSocket.current.onmessage = (event) => {
            console.log("이벤트 : ", JSON.parse(event.data));
            if (JSON.parse(event.data).type === "pre-prediction") {
                // 이전 결과값 초기화, 전체 사진 설정, 데이터 분석 진행중 시작
                // 결과값들 초기화
                setImgUrl();
                setPredValue();
                setMatchedData();
                setIsSuccess();
                setSelTruck();

                setIsWaiting(false);
                setProgressStatus(true);
                setImgUrl(JSON.parse(event.data).imageUrl)

            } else {
                setIsSuccess(JSON.parse(event.data).predictResult.success);
                setProgressStatus(false);
                setPredValue(JSON.parse(event.data).predictResult);
                setMatchedData(JSON.parse(event.data).predictResult.numberList)
                console.log("DB 데이터 : ", JSON.parse(event.data).predictResult.numberList);
                console.log("결과데이터 : ", JSON.parse(event.data).predictResult)
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
                    {
                        isWaiting
                            ? <p className="animate-pulse">고철장 내 차량을 감지하고 있습니다</p>
                            : progressStatus
                                ? <p>고철장 내 <span className="text-[#ff9a3c] font-bold">작업 차량</span>이 감지되었습니다</p>
                                : isSuccess
                                    ? <p>작업차량 번호판 추출에 <span className="text-[#54acff] font-bold">성공</span>하였습니다.</p>
                                    : <p>작업차량 번호판 추출에 <span className="text-[#ff5050] font-bold">실패</span>하였습니다.</p>
                    }
                </div>
                {/* 결과 표 - 항상표시 */}
                <div className="flex flex-col lg:flex-row gap-4 mt-[1rem]">
                    <InfoCard loginUser={loginUser} predValue={predValue} />
                    <NumberResult text="RESULT" isWaiting={isWaiting} progressStatus={progressStatus} isSuccess={isSuccess} predValue={predValue} />
                </div>
                {/* 이미지, 테이블 */}
                <div className=" flex flex-col lg:flex-row justify-between gap-4 mt-[1rem]">
                    <div className=" w-full">
                        <div className="mb-[1rem]">
                            <div className="rounded-md border-[1px] border-[#27282D]">
                                <Title title="인식된 차량 이미지" />
                                {
                                    isWaiting
                                        ? <IconMsgBox
                                            mdH="md:h-[300px]"
                                            icon={<GiCctvCamera />}
                                            msg="차량 인식 단말기에서 감지된 이미지를 표시합니다" />
                                        : <ResultImage mdH="md:h-[300px]" imgUrl={imgUrl} />
                                }
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between gap-3">
                            <div className="w-full">
                                <div className="rounded-md border-[1px] border-[#27282D]">
                                    <Title title="차량 추출" />
                                    {
                                        isWaiting
                                            ? <IconMsgBox mdH="md:h-[200px]" icon={<FaTruck />} msg="차량 객체를 추출하여 표시합니다" />
                                            : progressStatus
                                                ? <Loading mdH="md:h-[200px]" />
                                                : isSuccess
                                                    ? <ResultImage mdH="md:h-[200px]" imgUrl={predValue.objectImage} />
                                                    : <IconMsgBox mdH="md:h-[200px]" icon={<MdOutlineSmsFailed />} msg="차량 객체 추출에 실패하였습니다" />
                                    }
                                </div>
                            </div>
                            <div className=" w-full">
                                <div className="rounded-md border-[1px] border-[#27282D]">
                                    <Title title="번호판 추출" />
                                    {
                                        isWaiting
                                            ? <IconMsgBox mdH="md:h-[200px]" icon={<LuRectangleHorizontal />} msg="번호판을 추출하여 표시합니다" />
                                            : progressStatus
                                                ? <Loading mdH="md:h-[200px]" />
                                                : isSuccess
                                                    ? <ResultImage mdH="md:h-[200px]" imgUrl={predValue.licensePlateImage} />
                                                    : <IconMsgBox mdH="md:h-[200px]" icon={<MdOutlineSmsFailed />} msg="번호판 추출에 실패하였습니다" />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* DB 검색 결과 테이블 */}
                    <div className="w-full">
                        <div className="rounded-md border-[1px] border-[#27282D] ">
                            <Title title="등록 차량 검색 결과" />
                            {
                                isSuccess
                                    ? <ResultTable data={matchedData} setSelTruck={setSelTruck}/>
                                    :
                                    <div className="rounded-b-md h-[250px] lg:h-[550px]">
                                        <div className="bg-[#e2e2e2] flex flex-col gap-2 justify-center items-center text-gray-500 h-full rounded-b-md ">
                                            <AiFillDatabase className="text-4xl" />
                                            <p>DB에서 검색된 차량 정보를 표시합니다</p>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                {/* 결과 등록 버튼 */}
                <div className="flex justify-end mt-[1rem]">
                    {
                        isWaiting || progressStatus
                            ? ""
                            : isSuccess
                                ?
                                <div
                                    onClick={handleModal}
                                    className="transition-all bg-[#008E93] hover:bg-[#103c49] text-white rounded-md p-2 px-4 cursor-pointer">
                                    등록하기
                                </div>
                                :
                                <div
                                    onClick={handleReset}
                                    className="transition-all bg-[#008E93] hover:bg-[#103c49] text-white rounded-md p-2 px-4 cursor-pointer">
                                    초기화
                                </div>
                    }
                </div>
                {
                    openModal
                        ? <WorkInfoModal
                            setOpenModal={setOpenModal}
                            carId={selTruck} 
                            predId={predValue.predictId}
                            time={predValue.time}
                            writer={loginUser}
                            setIsWaiting={setIsWaiting}
                            setPredValue={setPredValue}
                            setMatchedData={setMatchedData}
                            setIsSuccess={setIsSuccess}
                            setSelTruck={setSelTruck} />
                        : ""
                }
            </div>
        </div>
    )
}

export default WebSocketMain;