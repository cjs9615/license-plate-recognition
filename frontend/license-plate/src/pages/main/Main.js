import { useEffect, useState } from "react"
import SideBar from "../../components/SideBar"
import { FiCamera } from "react-icons/fi";
import Modal from "../../components/Modal";

const Main = () => {
    const [imgUrl, setImgUrl] = useState();
    const [imgFile, setImgFile] = useState();
    // 드래그앤드롭
    const [isActive, setActive] = useState(false);
    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);
    // 이미지 전체보기 모달창
    const [modalOpen, setModalOpen] = useState(false);

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

        console.log("파일: ", file);

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
        console.log("파일: ", file);

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

        const formData = new FormData();
        formData.append('file', imgFile);

        fetch('http://10.125.121.216:8080/api/techtri/predict', {
            method: "POST",
            body: formData,
        })
            .then(resp => console.log("성공1"))
            .then(data => console.log("성공2"))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        console.log("파일 설정:", imgFile);
    }, [imgFile])

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
                            <button onClick={handleModalOpen} className="bg-inherit border-[2px] rounded-[10px] border-[#2E3D4E] text-[#2E3D4E] w-[85px] h-[35px] mt-[1rem]">전체보기</button>
                            <button onClick={predictImage} className="bg-inherit border-[2px] rounded-[10px] border-[#2E3D4E] text-[#2E3D4E] w-[85px] h-[35px] mt-[1rem]">결과확인</button>
                        </div>
                        <input type="file" id="targetImg" onChange={handleChangeFile} hidden accept=".jpg, .jpeg, .png"></input>

                    </div>
                    <div className="w-full lg:w-[50%] h-[400px] lg:h-full lg:p-2">
                        <h2 className="text-lg font-bold">RESULT</h2>
                        <div className="h-[150px] pb-1">
                            <img className="w-full h-full object-fill" src="https://techtri-s3-bucket.s3.ap-northeast-2.amazonaws.com/pre-prediction-images/48c60d70-9fe4-47b9-b92f-82b1945e1e17-3f877ffd-8390-4bc8-a9ff-2e9541c6d704.jpg"></img>
                        </div>
                        <div className="h-[150px] pt-1">
                            <img className="w-full h-full object-fill" src="https://techtri-s3-bucket.s3.ap-northeast-2.amazonaws.com/license-plate/7c487ef8-2ab4-4fb4-b407-9045a6b35b25-output.jpg"></img>
                        </div>
                        <div className="flex flex-col justify-center text-black h-[60px] mt-1">
                            <div className="flex justify-between items-center font-bold px-6">
                                <p>Object : truck</p>
                                <p>예측번호 : 1234</p>
                                <p>정확도 : 98%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-green-100 w-full mt-[1.5rem] h-[200px] md:h-[400px] border-t-2 border-black lg:p-2">
                    <h2 className="text-lg font-bold">DB 결과</h2>
                    <div className="border-[1px] border-black h-[300px] mt-2">
                        
                    </div>
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
