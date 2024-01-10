import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import ModalImage from "./ModalImage";

const PredInfoModal = ({ setInfoModalOpen, selPredId }) => {
    const handleModal = () => {
        setInfoModalOpen(false);
    }

    const [data, setData] = useState("");
    const [comment, setCommnet] = useState("")
    const [boxH, setBoxH] = useState();
    const [isSuccess, setIsSuccess] = useState();

    useEffect(() => {
        // isSuccess ? boxH ="h-[650px] md:h-[800px]" : boxH ="h-[400px]";

        const url = `http://10.125.121.216:8080/api/techtri/admin/predict/detail/${selPredId}`;

        fetch(url, { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                setData(data);
                setIsSuccess(data.predictDetail.isSuccess);
                setCommnet(data.predictDetail.comment)
                data.predictDetail.isSuccess ? setBoxH("h-[650px] md:h-[800px]") : setBoxH("h-[400px]")
            })
            .catch(err => console.log(err));

    }, [])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className={`relative bg-white font-bold drop-shadow-lg rounded-lg w-[600px] ${boxH} p-3 px-3 overflow-auto no-scrollbar`}>
                <div className="flex justify-center">
                    <h1 className="text-xl font-bold">추론 기록 상세보기</h1>
                </div>
                <div className="flex flex-col gap-2 px-6 mt-[1rem] ">
                    <div>
                        번호 추출 : {
                            isSuccess
                                ? <span className="text-green-600">성공</span>
                                : <span className="text-red-500">실패</span>
                        }
                    </div>
                    {
                        data&&isSuccess
                            ?
                            <div>
                                추론결과 : <span className="font-normal">{data.predictDetail.number.replace(/[^\s\d]/g, "").slice(-4)}</span>
                            </div>
                            :
                            <div>
                                비고 : <span>{comment.substring(0,comment.indexOf(":"))}</span>
                            </div>

                    }
                    {
                        data && data
                            ?
                            <>
                                <div>
                                    날짜 : <span className="font-normal">{data.predictDetail.time.replace('T', ' ').slice(0, 19)}</span>
                                </div>
                                <ModalImage title="감지된 이미지" imgUrl={data.imageList[0].url} marginT="mt-[1rem]" />
                            </>
                            : ""
                    }

                    {
                        isSuccess
                            ?
                            <>
                                <ModalImage title="차량 이미지" imgUrl={data.imageList[2].url} />
                                <ModalImage title="번호판 이미지" imgUrl={data.imageList[1].url} />
                            </>
                            : ""
                    }


                </div>
                <div className=" absolute top-0 right-0 p-2 px-3">
                    <button onClick={handleModal}>
                        <IoMdCloseCircleOutline className="text-3xl" />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default PredInfoModal
