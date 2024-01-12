
const PredLogListItem = ({ id, idx, number, isSuccess, time, page, setInfoModalOpen, setSelPredId }) => {

    const handleOpenModal = () => {
        setInfoModalOpen(true);
        setSelPredId(id);
    }

    return (
        <tr key={id} className="bg-white border-b ">
            <td className="px-6 py-4 hidden md:block">{idx + (10 * (page - 1)) + 1}</td>
            <td className="px-6 py-4">
                {
                    isSuccess
                        ? <p className="rounded-full py-1 px-3 font-bold text-green-700">성공</p>
                        : <p className="rounded-full py-1 px-3 font-bold text-red-700">실패</p>
                }
            </td>
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                {
                    isSuccess
                        ? <p>{number.replace(/[^\s\d]/g, "").slice(-4)}</p>
                        : <p>X</p>
                }
            </td>
            <td className="px-6 py-4 hidden md:block">
                {time.replace('T', ' ').slice(0, 19)}
            </td>
            <td className="px-6 py-4">
                <button onClick={handleOpenModal}>상세보기</button>
            </td>
        </tr>
    )
}

export default PredLogListItem
