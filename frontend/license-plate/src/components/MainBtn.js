
const MainBtn = ({handleButton, bgColor, btnText}) => {
    return (
        <button onClick={handleButton} className={`transition-all bg-[${bgColor}] hover:bg-[#103c49] text-white tracking-widest w-full h-[35px] mt-[1rem]`}>
            {btnText}
        </button>
    )
}

export default MainBtn
