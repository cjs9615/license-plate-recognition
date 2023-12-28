
const MainTable = ({ data }) => {
    const tbodyItem = data.map((item) => {
        return (
            <tr key={item.seq} className="border-b-2">
                <td className="py-2">{item.seq}</td>
                <td>{item.plateNumber}</td>
                <td>{item.regiDate.slice(0,10)}</td>
            </tr>

        )
    })
    return (
        <div className="w-full">
            <table className="table-fixed w-full">
                <thead className="text-left">
                    <tr>
                        <th>번호</th>
                        <th>차량번호</th>
                        <th>등록일</th>
                    </tr>
                </thead>
                <tbody>
                    {tbodyItem}
                </tbody>
            </table>
        </div>
    )
}

export default MainTable
