import { useEffect, useState } from "react"
import SideBar from "../../components/SideBar"
import { FiCamera } from "react-icons/fi";
import { AiOutlinePicture } from "react-icons/ai";
import Modal from "../../components/Modal";
// import MainBtn from "../../components/MainBtn";
import MainTable from "../../components/MainTable";
import loadingGIF from "../../images/loadingIcon.gif";

const Main = () => {
    const [imgUrl, setImgUrl] = useState();
    const [imgFile, setImgFile] = useState();

    // 드래그앤드롭
    const [isActive, setActive] = useState(false);
    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);

    // 이미지 전체보기 모달창
    const [modalOpen, setModalOpen] = useState(false);

    // 추론
    const [progressStatus, setProgressStatus] = useState(false);
    const [predValue, setPredValue] = useState();
    const [matchedData, setMatchedData] = useState();

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    // 이미지 미리보기
    const handleChangeFile = (e) => {
        if (e.target.files.length === 0) {
            setImgUrl();
            setImgFile();
            return;
        }

        const file = e.target.files[0];

        // console.log("파일: ", file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            setImgUrl(e.target.result);
        }
        setImgFile(file);
    }


    // 드롭했을때 새창 x
    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        // console.log("파일: ", file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            setImgUrl(e.target.result);
        }
        setImgFile(file);
    }

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
                    console.log("성공");
                    setProgressStatus(false);
                    console.log("데이터: ", data);
                    setPredValue(data);
                    setMatchedData(data.numberList);
                } else {
                    setProgressStatus(false);
                    console.log("실패")
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">MAIN</h1>
                </div>
                <div className="flex gap-4 flex-col lg:flex-row w-full mt-[1rem] h-[800px] lg:h-[400px]">
                    <div className="w-full lg:w-[50%] h-[400px] lg:h-full lg:p-2">
                        <h2 className="text-lg font-bold">INPUT</h2>
                        <label
                            htmlFor="targetImg"
                            onDragEnter={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragEnd}
                            onDrop={handleDrop}>
                            {
                                imgUrl && imgUrl
                                    ? <div className="w-full h-[300px]">
                                        <img className="w-full h-full object-cover" src={imgUrl}></img>
                                    </div>
                                    :
                                    <div className={`${isActive ? ' border-[#747474] bg-[#e2e2e2]' : ''} transition-all bg-[#EDEDED] hover:bg-[#e2e2e2] border-dashed border-[2px] border-[#c2c1c1] hover:border-[#747474] w-full h-[300px]`}>
                                        <div className="flex w-full h-full">
                                            <div className="flex flex-col gap-2 justify-center m-auto">
                                                <FiCamera className="text-4xl text-gray-600 w-full" />
                                                <p className="text-gray-600">클릭 또는 파일을 이곳에 드롭하세요</p>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </label>
                        <div className="flex justify-between items-center">
                            <button onClick={handleModalOpen} className={`transition-all bg-[#1D647A] hover:bg-[#103c49] text-white tracking-widest w-full h-[35px] mt-[1rem]`}>
                                전체보기
                            </button>
                            <button onClick={predictImage} className={`transition-all bg-[#008E93] hover:bg-[#103c49] text-white tracking-widest w-full h-[35px] mt-[1rem]`}>
                                결과확인
                            </button>
                        </div>
                        <input type="file" id="targetImg" onChange={handleChangeFile} hidden accept=".jpg, .jpeg, .png"></input>
                    </div>
                    <div className="w-full lg:w-[50%] h-[400px] lg:h-full lg:p-2">
                        <h2 className="text-lg font-bold">RESULT</h2>
                        <div>
                            <div className="h-[150px] pb-1">
                                <div className="flex justify-center items-center bg-[#D9D9D9] w-full h-full m-auto">
                                    {
                                        predValue && predValue
                                            ? <img className="w-full h-full object-fill" src={`${imgUrl}`}></img>
                                            : <div className="flex flex-col">
                                                {
                                                    progressStatus
                                                        ? <img src={loadingGIF} className="w-full" ></img>
                                                        : <div>
                                                            <AiOutlinePicture className="text-4xl text-gray-500 w-full" />
                                                            <p className="text-sm text-gray-500">차량 객체를 인식하여 표시합니다</p>
                                                        </div>
                                                }
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="h-[150px] pb-1">
                                <div className="flex justify-center items-center bg-[#D9D9D9] w-full h-full m-auto">
                                    {
                                        predValue && predValue
                                            ? <img className="w-full h-full object-fill" src={`${predValue.licensePlateImage}`}></img>
                                            : <div className="flex flex-col">
                                                {
                                                    progressStatus
                                                        ? <img src={loadingGIF} className="w-full" ></img>
                                                        : <div>
                                                            <AiOutlinePicture className="text-4xl text-gray-500 w-full" />
                                                            <p className="text-sm text-gray-500">번호판을 인식하여 표시합니다</p>
                                                        </div>
                                                }
                                            </div>
                                    }

                                </div>
                            </div>
                            {
                                predValue && predValue
                                    ? <div className="flex flex-col justify-center text-black h-[60px] mt-1">
                                        <div className="flex flex-col md:flex-row justify-between items-center font-bold px-2 mt-3 md:mt-0">
                                            <p>Object : ???</p>
                                            <p>예측번호 : {predValue.predictResult}</p>
                                            <p>정확도 : ???</p>
                                        </div>
                                    </div>
                                    : <div>
                                        {
                                            progressStatus
                                                ? <p>데이터 분석중입니다. 잠시만 기다려주세요...</p>
                                                : ""
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className=" w-full mt-[1.5rem] border-t-2 border-black lg:p-2">
                    <h2 className="text-lg font-bold">DB 결과</h2>
                    {
                        matchedData && matchedData
                            ? <MainTable data={matchedData} />
                            : ""
                    }
                </div>
            </div>
            {
                modalOpen
                    ? <Modal setModalOpen={setModalOpen} imgUrl={imgUrl} />
                    : ""
            }
        </div>
    )
}

export default Main
