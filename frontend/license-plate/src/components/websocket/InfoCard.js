
const InfoCard = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 bg-[#474E58] items-center text-gray-400 rounded-md p-3 px-6">
            <div className="w-[240px]">이벤트 : <span className="text-white">작업차량 감지</span></div>
            <div>작성자 : <span className="text-white">member</span></div>
            <div>날짜 : <span className="text-white">2024-01-07</span></div>
            <div>감지시간 : <span className="text-white">15:10:59</span></div>
        </div>
    )
}

export default InfoCard
