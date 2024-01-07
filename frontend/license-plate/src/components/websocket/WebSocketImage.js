import loadingIcon from "../../images/loadingIcon2.gif"

const WebSocketImage = ({ title, mdH, icon, msg }) => {
    return (
        <div className="rounded-md border-[1px] border-[#27282D]">
            <div className="bg-[#27282D] rounded-t-sm text-white px-4 py-1">
                {title}
            </div>
            <div className={`bg-[#e2e2e2] rounded-b-md h-[200px] ${mdH}`}>
                <div className="flex flex-col gap-2 justify-center items-center text-4xl text-gray-500 h-full ">
                    {/* <img src={loadingIcon} className="scale-50"></img> */}
                    {icon}
                    <p className="text-base">{msg}</p>
                </div>
            </div>
        </div>
    )
}

export default WebSocketImage
