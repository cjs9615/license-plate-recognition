import SideBar from "../../components/comm/SideBar"
import { useEffect, useRef, useState } from "react"
import { FiCamera } from "react-icons/fi";
import loadingGIF from "../../images/loadingIcon.gif"
import { AiOutlinePicture } from "react-icons/ai";
import MainTable from "../../components/main/MainTable"
import MainCard from "../../components/main/MainCard";
import { Link } from "react-router-dom";

const Test = () => {
    const webSocket = useRef(null);

    // Input
    const [imgUrl, setImgUrl] = useState();

    // Result
    const [predValue, setPredValue] = useState();
    const [progressStatus, setProgressStatus] = useState(false);
    const [matchedData, setMatchedData] = useState();
    
    useEffect(()=>{
        console.log("결과 데이터 리스트 : ",matchedData)
    },[matchedData])

    useEffect(() => {
        webSocket.current = new WebSocket("ws://10.125.121.216:8080/pushservice");
        webSocket.current.onopen = () => {
            console.log("연결");
        }

        webSocket.current.onmessage = (event) => {
            console.log("이벤트 : ", JSON.parse(event.data));
            if (JSON.parse(event.data).type === "pre-prediction") {
                setPredValue();
                setMatchedData();
                setImgUrl(JSON.parse(event.data).url)
                setProgressStatus(true);
            } else {
                setProgressStatus(false);
                setPredValue(JSON.parse(event.data).predictResult);
                setMatchedData(JSON.parse(event.data).predictResult.numberList)
                console.log("DB 데이터 : ",JSON.parse(event.data).predictResult.numberList);
                console.log("결과데이터 : ", JSON.parse(event.data).predictResult)
            }
        };
    }, [])

    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="flex justify-between items-center border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">MONITORING</h1>
                    <Link to="/test"><button>직접입력</button></Link>
                </div>
                <div className="flex gap-4 flex-col lg:flex-row w-full mt-[1rem] h-[800px] lg:h-[400px]">
                    {/* INPUT */}
                    <div className="w-full lg:w-[50%] h-[400px] lg:h-full lg:p-2">
                        <h2 className="text-lg font-bold">INPUT</h2>
                        {
                            imgUrl && imgUrl
                                ? <div className="w-full h-[350px]">
                                    <img className="w-full h-full object-cover" src={imgUrl} alt="truckImage"></img>
                                </div>
                                :
                                <div className={` transition-all bg-[#EDEDED]  border-[#c2c1c1] w-full h-[350px]`}>
                                    <div className="flex w-full h-full">
                                        <div className="flex flex-col gap-2 justify-center m-auto">
                                            <FiCamera className="text-4xl text-gray-600 w-full" />
                                            <p className="text-gray-600">차량 이미지를 표시합니다.</p>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>

                    {/* RESULT */}
                    <div className="w-full lg:w-[50%] h-[400px] lg:h-full lg:p-2">
                        <h2 className="text-lg font-bold">RESULT</h2>
                        <div>
                            <div className="h-[177px] pb-1">
                                <div className="flex justify-center items-center bg-[#D9D9D9] w-full h-full m-auto">
                                    {
                                        predValue && predValue
                                            ? <img className="w-full h-full object-fill" src={`${imgUrl}`} alt="truck" ></img>
                                            : <div className="flex flex-col">
                                                {
                                                    progressStatus
                                                        ? <img src={loadingGIF} className="w-full" alt="loading gif" ></img>
                                                        : <div>
                                                            <AiOutlinePicture className="text-4xl text-gray-500 w-full" />
                                                            <p className="text-sm text-gray-500">차량 객체를 인식하여 표시합니다</p>
                                                        </div>
                                                }
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="h-[177px] pb-1">
                                <div className="flex justify-center items-center bg-[#D9D9D9] w-full h-full m-auto">
                                    {
                                        predValue && predValue
                                            ? <img className="w-full h-full object-fill" src={`${predValue.licensePlateImage}`} alt="number plate"></img>
                                            : <div className="flex flex-col">
                                                {
                                                    progressStatus
                                                        ? <img src={loadingGIF} className="w-full" alt="loading gif"></img>
                                                        : <div>
                                                            <AiOutlinePicture className="text-4xl text-gray-500 w-full" />
                                                            <p className="text-sm text-gray-500">번호판을 인식하여 표시합니다</p>
                                                        </div>
                                                }
                                            </div>
                                    }

                                </div>
                            </div>
                            <div>
                                {
                                    progressStatus
                                        ? <p>데이터 분석중입니다. 잠시만 기다려주세요...</p>
                                        : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* 결과부분 */}
                <div className="flex flex-col lg:flex-row gap-6 w-full mt-[1.5rem] mb-[2.5rem] lg:mb-0 border-t-2 border-[#eee] lg:p-2">

                    {/* <MainTable data={testData} setTruckNumber={setTruckNumber} /> */}
                    {
                        matchedData && matchedData
                        ?
                        <MainTable data={matchedData} setTruckNumber="1234" />
                        : ""
                    }
                    {/* <MainCard resultTime={resultTime} truckNumber={truckNumber} predictId="29" />*/ }
                    {
                        predValue && predValue.predictResult
                            ? <MainCard resultTime={predValue.time} truckNumber="경북81아7822" predictResult={predValue.predictResult} predictId={predValue.predictId} />
                            : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default Test;