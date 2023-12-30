import { LuCopyPlus } from "react-icons/lu";

const MainTable = ({ data, setTruckNumber }) => {
    const selTruck = (seq, plateNumber) => {
        const selData = [seq, plateNumber];
        setTruckNumber(selData);
    }
    const tbodyItem = data.map((item, idx) => {

        return (
            <tr key={item.seq} onClick={() => selTruck(item.seq, item.plateNumber)} className="transition-all border-b even:bg-gray-100 hover:bg-[#ffd3af] cursor-pointer">
                <td>{idx + 1}</td>
                <td>{item.plateNumber}</td>
                <td>{item.regiDate.slice(0, 10)}</td>
                <td className="flex justify-center items-center py-3">
                    <LuCopyPlus className="text-xl text-[#555]" />
                </td>
            </tr>

        )
    })
    return (
        <div className="grow">
            <h2 className="text-lg font-bold pt-3">DB 검색</h2>
            <div className="w-full mt-2">
                <table className="table-auto w-full ">
                    <thead className="text-center bg-[#EDEDED]">
                        <tr>
                            <th className="py-2">번호</th>
                            <th>차량번호</th>
                            <th>등록일</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {tbodyItem}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MainTable
