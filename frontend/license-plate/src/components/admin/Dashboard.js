

const Dashboard = ({ bgColor, title, value, icon, detail1, detail2 }) => {
    return (
        <div className={`${bgColor} text-white rounded-md h-[130px] mt-[1rem] p-3 px-6`}>
            <div className="flex justify-between h-[80px]">
                <div className="flex flex-col justify-center text-4xl font-bold">
                    {value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div className="hidden md:flex md:flex-col justify-center text-sm">
                    <div className="flex gap-4 items-center">
                        <div>
                            <p>{detail1}</p>
                            <p>{detail2}</p>
                        </div>
                        <div className="text-4xl">
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-sm">
                {title}
            </div>
        </div>
    )
}

export default Dashboard
