import { LuCopyPlus } from "react-icons/lu";

const TbodyItem = ({id, idx, plateNumber, bgColor, regiDate, setSelTruck, setSelItem}) => {
    const handleSelItem = (id, plateNumber) => {
        setSelTruck([id, plateNumber]);
        setSelItem(id);
    }

    return (
        <tr key={id} 
            onClick={() => handleSelItem(id, plateNumber)} 
            className={`transition-all border-b ${bgColor} hover:bg-[#ffd3af] cursor-pointer`}>
            <td>{idx + 1}</td>
            <td>{plateNumber}</td>
            <td>{regiDate}</td>
            <td className="flex justify-center items-center py-3">
                <LuCopyPlus className="text-xl text-[#555]" />
            </td>
        </tr>
    )
}

export default TbodyItem
