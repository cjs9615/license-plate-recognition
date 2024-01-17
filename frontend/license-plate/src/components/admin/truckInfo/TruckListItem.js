import { useState } from "react"

const TruckListItem = ({id, plateNumber, regiDate, status, page, idx}) => {
    const [isActive, setIsActive] = useState(status);

    const handleActive = (e) => {
        setIsActive(e.target.checked);

        const url = `http://10.125.121.216:8080/api/techtri/admin/car/status/${id}`;
        
        fetch(url, {
            method:"PUT",
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        })
        .then(resp => console.log(resp))
        .catch(err => console.log(err));
    }

    return (
        <tr key={id} className="bg-white border-b ">
            <td className="px-6 py-4 hidden md:block">{idx + (10 * (page - 1)) + 1}</td>
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                {plateNumber}
            </td>
            <td className="px-6 py-4 hidden md:block">
                {regiDate}
            </td>
            <td className="px-6 py-4">
                {
                    isActive
                        ? <span className="bg-green-100 rounded-full py-1 px-3 font-bold text-green-700">&nbsp;Active&nbsp;</span>
                        : <span className="bg-red-100 rounded-full py-1 px-3 font-bold text-red-700">inactive</span>
                }
                
            </td>
            <td className="text-lg px-6 py-4">
                <label className="relative inline-flex items-center  cursor-pointer">
                    <input type="checkbox" onChange={handleActive} className="sr-only peer" defaultChecked={status} />
                    <div className="scale-90 w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </td>
        </tr>
    )
}

export default TruckListItem
