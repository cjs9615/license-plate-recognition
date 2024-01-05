import { useState } from "react"
import SideBar from "../../components/comm/SideBar"
import MainModal from "../../components/main/MainModal";
import MainTable from "../../components/main/MainTable";
import MainCard from "../../components/main/MainCard";
import MainInput from "../../components/main/MainInput";
import MainResult from "../../components/main/MainResult";
import { Link } from "react-router-dom";

const Main = () => {
    const [imgUrl, setImgUrl] = useState();
    const [imgFile, setImgFile] = useState();

    // 이미지 전체보기 모달창
    const [modalOpen, setModalOpen] = useState(false);

    // 추론
    const [progressStatus, setProgressStatus] = useState(false);
    const [predValue, setPredValue] = useState();
    const [matchedData, setMatchedData] = useState();

    // 선택된 차량번호
    const [truckNumber, setTruckNumber] = useState();

    // 이미지 파일 전송
    const predictImage = () => {
        if (!imgFile) {
            alert("이미지를 선택해주세요");
            return;
        }

        setProgressStatus(true);

        const formData = new FormData();
        formData.append('file', imgFile);

        fetch('http://10.125.121.216:8080/api/techtri/predict', {
            method: "POST",
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.success) {
                    setProgressStatus(false);
                    console.log("데이터: ", data);
                    setPredValue(data);
                    setMatchedData(data.numberList);

                } else {
                    setProgressStatus(false);
                    // 실패했을때 처리하기
                    console.log("실패")
                }
            })
            .catch(err => console.log(err));
    }

    return (
        // <div className="grow flex flex-col md:flex-row">
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="flex justify-between items-center border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">MAIN</h1>
                    <Link to="/main"><button>WebSocket</button></Link>
                </div>
                <div className="flex gap-4 flex-col lg:flex-row w-full mt-[1rem] h-[800px] lg:h-[400px]">
                    <MainInput
                        imgUrl={imgUrl} setImgUrl={setImgUrl}
                        setImgFile={setImgFile}
                        setMatchedData={setMatchedData}
                        setPredValue={setPredValue}
                        setModalOpen={setModalOpen}
                        predictImage={predictImage}
                    />
                    <MainResult
                        imgUrl={imgUrl}
                        predValue={predValue}
                        progressStatus={progressStatus}
                    />
                </div>
                <div className="flex flex-col lg:flex-row gap-6 w-full mt-[1.5rem] mb-[2.5rem] lg:mb-0 border-t-2 border-[#eee] lg:p-2">
                    {/* <MainCard resultTime={resultTime} truckNumber={truckNumber} predictId="29" /> */}
                    {
                        predValue && predValue.predictResult
                            ? <MainCard
                                truckNumber={truckNumber}
                                predictResult={predValue.predictResult}
                                predictId={predValue.predictId}
                                time={predValue.time}
                                setImgUrl={setImgUrl}
                                setPredValue={setPredValue}
                                setMatchedData={setMatchedData} />
                            : ""
                    }

                    {/* <MainTable data={testData} setTruckNumber={setTruckNumber} /> */}
                    {
                        matchedData && matchedData
                            ?
                            <MainTable data={matchedData} setTruckNumber={setTruckNumber} />
                            : ""
                    }
                </div>
            </div>
            {
                modalOpen
                    ? <MainModal setModalOpen={setModalOpen} imgUrl={imgUrl} />
                    : ""
            }
        </div>
    )
}

export default Main
