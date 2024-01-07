import { LuCopyPlus } from "react-icons/lu";
import { AiFillDatabase } from "react-icons/ai";

const ResultTable = () => {

    // const tbodyItem = data.map((item, idx) => {

    //     return (
    //         <tr key={item.id} onClick={() => selTruck(item.id, item.plateNumber)} className="transition-all border-b even:bg-gray-100 hover:bg-[#ffd3af] cursor-pointer">
    //             <td>{idx + 1}</td>
    //             <td>{item.plateNumber}</td>
    //             <td>{item.regiDate}</td>
    //             <td className="flex justify-center items-center py-3">
    //                 <LuCopyPlus className="text-xl text-[#555]" />
    //             </td>
    //         </tr>

    //     )
    // })

    const tbodyItem =
        <>
            <tr>
                <td>1</td>
                <td>경기84수7440</td>
                <td>2022-11-21</td>
                <td className="flex justify-center items-center py-3">
                    <LuCopyPlus className="text-xl text-[#555]" />
                </td>
            </tr>
        </>

    return (
        <div className="rounded-md border-[1px] border-[#27282D] ">
            <div className="bg-[#27282D] rounded-t-sm text-white px-4 py-1">
                등록 차량 검색 결과
            </div>
            <div className="rounded-b-md h-[250px] lg:h-[550px]">
                {/* <table className="table-auto w-full">
                    <thead className="text-center ">
                        <tr className="text-sm ">
                            <th className="h-[33px]">번호</th>
                            <th>차량번호</th>
                            <th>등록일</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-center bg-gray-50">
                        {tbodyItem}
                    </tbody>
                </table> */}
                <div className="bg-[#e2e2e2] flex flex-col gap-2 justify-center items-center text-gray-500 h-full rounded-b-md ">
                    <AiFillDatabase className="text-4xl"/>
                    <p>DB에서 검색된 차량 정보를 표시합니다</p>
                </div>
            </div>
        </div>
    )
}

export default ResultTable
