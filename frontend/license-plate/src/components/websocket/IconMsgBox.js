
const IconMsgBox = ({ mdH, icon, msg }) => {
    return (
        <div className={`bg-[#e2e2e2] rounded-b-md h-[200px] ${mdH}`}>
            <div className="flex flex-col gap-2 justify-center items-center text-4xl text-gray-500 h-full ">
                {icon}
                <p className="text-base">{msg}</p>
            </div>
        </div>
    )
}

export default IconMsgBox
