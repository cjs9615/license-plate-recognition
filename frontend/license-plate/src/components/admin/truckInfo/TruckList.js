import TruckListItem from "./TruckListItem"

const TruckList = ({ searchData, page }) => {

    return (
        <div className="">
            <div className="relative ">
                <table className="w-full text-xs md:text-sm rtl:text-right text-gray-900 text-center">
                    <thead className="text-xs text-gray-700 bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 hidden md:block">
                                번호
                            </th>
                            <th scope="col" className="px-6 py-3">
                                차량번호
                            </th>
                            <th scope="col" className="px-6 py-3 hidden md:block">
                                등록일
                            </th>
                            <th scope="col" className="px-6 py-3">
                                상태
                            </th>
                            <th scope="col" className="px-6 py-3">
                                관리
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            searchData && searchData.map((item, idx) => <TruckListItem key={`data${idx}`} id={item.id} plateNumber={item.plateNumber} regiDate={item.regiDate} status={item.status} page={page} idx={idx}/> )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TruckList
