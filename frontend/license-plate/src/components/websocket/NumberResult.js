
const NumberResult = ({text, progressStatus, isWaiting, isSuccess, predValue}) => {
    return (
        <div className={`border-[#474E58] border-2 rounded-md flex grow h-[70px] justify-center items-center text-3xl font-bold text-gray-300`}>
            {
                isWaiting || progressStatus
                ? <p>{text}</p>
                : isSuccess
                ? <p className="text-black">{predValue.predictResult}</p>
                : <p className="text-red-500">X</p>
            }
        </div>
    )
}

export default NumberResult
