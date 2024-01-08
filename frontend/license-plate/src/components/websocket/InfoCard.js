
const InfoCard = ({loginUser, predValue}) => {
    const getToday = () => {
        const date = new Date(); 
        const year = date.getFullYear(); 
        const month = ('0' + (date.getMonth() + 1)).slice(-2); 
        const day = ('0' + (date.getDate())).slice(-2); 
        const today = `${year}-${month}-${day}`;
        
        return today;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 bg-[#474E58] items-center text-gray-400 rounded-md p-3 px-6">
            <div className="w-[240px]">이벤트 : <span className="text-white">작업차량 등록</span></div>
            <div>작성자 : <span className="text-white">{loginUser}</span></div>
            <div>날짜 : <span className="text-white">{getToday()}</span></div>
            <div>감지시간 : <span className="text-white">{
                predValue && predValue.time.slice(-8)
            }</span></div>
        </div>
    )
}

export default InfoCard
