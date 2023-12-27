import { IoMdCloseCircleOutline } from "react-icons/io";

const Modal = ({ setModalOpen, imgUrl }) => {
    const handleModalOepn = () => {
        setModalOpen(false);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white drop-shadow-lg rounded-lg w-[700px] h-[350px] md:h-[480px] p-2 px-3">
                <div className="flex justify-end mb-2">
                    <button onClick={handleModalOepn}>
                        <IoMdCloseCircleOutline className="text-3xl " />
                    </button>
                </div>
                <div className={`${imgUrl ? "" :'bg-[#EDEDED]'} w-full h-[270px] md:h-[400px]`}>
                    {
                        imgUrl
                            ? <img className="w-full h-full object-contain" src={imgUrl}></img>
                            :
                            <div className="flex w-full h-full">
                                <p className="m-auto text-gray-600">이미지를 선택해주세요</p>
                            </div>
                    }
                </div>
            </div>

        </div>
    )
}

export default Modal
