import loadingIcon from "../../images/loadingIcon2.gif"

const Loading = ({ mdH }) => {
    return (
        <div className={`bg-[#e2e2e2] rounded-b-md h-[200px] ${mdH}`}>
            <div className="flex flex-col gap-2 justify-center items-center text-4xl text-gray-500 h-full ">
                <img src={loadingIcon} className="scale-50" alt="loading"></img>
            </div>
        </div>

    )
}

export default Loading
