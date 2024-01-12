import PredLogListItem from "./PredLogListItem"

const PredLogList = ({predLogData, page, setInfoModalOpen, setSelPredId}) => {
    return (
        <div>
            <div className="relative ">
                <table className="w-full text-xs md:text-sm rtl:text-right text-gray-900 text-center">
                    <thead className="text-xs text-white bg-[#2E3D4E]">
                        <tr>
                            <th scope="col" className="px-6 py-3 hidden md:block">
                                번호
                            </th>
                            <th scope="col" className="px-6 py-3">
                                번호추출
                            </th>
                            <th scope="col" className="px-6 py-3">
                                추론결과
                            </th>
                            <th scope="col" className="px-6 py-3 hidden md:block">
                                날짜
                            </th>
                            <th scope="col" className="px-6 py-3">
                                
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            predLogData && predLogData.map((item, idx) => <PredLogListItem key={`data${idx}`} id={item.id} idx={idx} number={item.number} time={item.time} isSuccess={item.isSuccess} page={page} setInfoModalOpen={setInfoModalOpen} setSelPredId={setSelPredId}/> )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PredLogList
