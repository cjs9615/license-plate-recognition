import { TbTruckOff } from "react-icons/tb";

const TruckList = ({ searchData, page }) => {

    const list = searchData.map((item, idx) => {
        return (
            <tr key={item.plateNumber} className="bg-white border-b ">
                <td className="px-6 py-4 hidden md:block">{idx + (10 * (page - 1)) + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.plateNumber}
                </td>
                <td className="px-6 py-4 hidden md:block">
                    {item.regiDate}
                </td>
                <td className="px-6 py-4">
                    {
                        item.status
                            ? <span className="bg-green-100 rounded-full py-1 px-3 font-bold text-green-700">Active</span>
                            : <span className="bg-red-100 rounded-full py-1 px-3 font-bold text-red-700">inactive</span>
                    }
                </td>
                <td className="flex justify-center items-center px-6 py-4">
                    {/* <TbTruckOff className="transition-all w-[50%] rounded-full active:bg-red-500 active:text-white cursor-pointer" /> */}
                    삭제
                </td>
            </tr>
        )
    })
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
                        {list}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TruckList
