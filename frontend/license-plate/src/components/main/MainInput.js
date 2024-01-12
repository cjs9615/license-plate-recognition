import { useState } from "react";
import { FiCamera } from "react-icons/fi";

const MainInput = ({imgUrl, setImgUrl, setImgFile, setMatchedData, setPredValue, setModalOpen, predictImage}) => {
    // 드래그앤드롭
    const [isActive, setActive] = useState(false);
    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);

    // 이미지 미리보기
    const handleChangeFile = (e) => {
        if (e.target.files.length === 0) {
            setImgUrl();
            setImgFile();
            return;
        }
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            setImgUrl(e.target.result);
        }
        setImgFile(file);

        // 결과 초기화
        setMatchedData();
        setPredValue();
    }


    // 드롭했을때 새창 x
    const handleDragOver = (e) => {
        e.preventDefault();
    }

    // 드래그 앤 드롭
    const handleDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            setImgUrl(e.target.result);
        }
        setImgFile(file);

        // 결과 초기화
        setMatchedData();
        setPredValue();
    }

    // 이미지 전체보기 모달 오픈
    const handleModalOpen = () => {
        setModalOpen(true);
    }


    return (
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
                            <img className="w-full h-full object-cover" src={imgUrl} alt="truckImage"></img>
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
    )
}

export default MainInput
