
const NumberResult = ({text, textColor}) => {
    return (
        <div className={`border-[#474E58] border-2 rounded-md flex grow h-[70px] justify-center items-center text-3xl font-bold ${textColor}`}>
            {text}
        </div>
    )
}

export default NumberResult
