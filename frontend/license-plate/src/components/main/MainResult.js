
import loadingGIF from "../../images/loadingIcon.gif";
import { AiOutlinePicture } from "react-icons/ai";

const MainResult = ({ predValue, progressStatus}) => {
    return (
        <div className="w-full lg:w-[50%] h-[400px] lg:h-full lg:p-2">
            <h2 className="text-lg font-bold">RESULT</h2>
            <div>
                <div className="h-[177px] pb-1">
                    <div className="flex justify-center items-center bg-[#D9D9D9] w-full h-full m-auto">
                        {
                            predValue && predValue
                                ? <img className="w-full h-full object-fill" src={`${predValue.objectImage}`} alt="truck" ></img>
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
    )
}

export default MainResult
