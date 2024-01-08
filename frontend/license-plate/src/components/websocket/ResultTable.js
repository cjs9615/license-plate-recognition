import { useState } from "react";
import TbodyItem from "./TbodyItem";

const ResultTable = ({ data, setSelTruck }) => {
    const [selItem, setSelItem] = useState([]);

    return (
        <div className="rounded-b-md h-[250px] lg:h-[550px]">
            <table className="table-auto w-full">
                <thead className="text-center bg-gray-100 ">
                    <tr className="text-sm ">
                        <th className="h-[33px]">번호</th>
                        <th>차량번호</th>
                        <th>등록일</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="text-center bg-white">
                    {
                        selItem && data.map((item, idx) => {
                            if (item.id === selItem) {
                                return (<TbodyItem
                                    key={`tbodyItem${item.id}`}
                                    id={item.id}
                                    idx={idx}
                                    bgColor="bg-[#ffd3af]"
                                    plateNumber={item.plateNumber}
                                    regiDate={item.regiDate}
                                    setSelTruck={setSelTruck}
                                    setSelItem={setSelItem} />)
                            } else {
                                return (<TbodyItem
                                    key={`tbodyItem${item.id}`}
                                    id={item.id}
                                    idx={idx}
                                    plateNumber={item.plateNumber}
                                    regiDate={item.regiDate}
                                    setSelTruck={setSelTruck}
                                    setSelItem={setSelItem} />)
                            }
                        })
                    }
                </tbody>
            </table>
        </div>

    )
}

export default ResultTable
