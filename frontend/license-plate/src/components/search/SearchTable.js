const SearchTable = ({ currentItems, page, onRowClick }) => {
    // console.log(currentItems);

    const items = Array.isArray(currentItems) ? currentItems : [];
    const rowsPerPage = 10;
    const emptyRows = rowsPerPage - items.length;

    return (
        <table className="w-full sm:h-[40rem] md:text-sm rtl:text-right text-gray-900 text-center">
            <thead className="text-gray-700 bg-gray-50">
                <tr>
                    <th scope="col" className="text-[7px] sm:text-sm lg:text-base py-2 lg:px-6 lg:py-3">번호</th>
                    <th scope="col" className="text-[7px] sm:text-sm lg:text-base py-2 lg:px-6 lg:py-3">차량번호</th>
                    <th scope="col" className="text-[7px] sm:text-sm lg:text-base py-2 lg:px-6 lg:py-3">날짜</th>
                    <th scope="col" className="text-[7px] sm:text-sm lg:text-base py-2 lg:px-6 lg:py-3">작성자</th>

                </tr>
            </thead>
            <tbody>
                {items.map((item, idx) => (
                    <tr key={idx} onClick={() => onRowClick(item.seq)} className="bg-white border-b-[1px] hover:cursor-pointer hover:bg-orange-100">
                        <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">{(idx + (10 * (page - 1)) + 1)}</td>
                        <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">{item.plateNumber}</td>
                        <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">{item.timestamp.split("T")[0]}</td>
                        <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">{item.writer}</td>
                    </tr>
                ))}
                {emptyRows > 0 && (
                    Array.from({ length: emptyRows }).map((_, index) => (
                        <tr key={index} className="bg-white border-b-[1px] border-white">
                            <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">&nbsp;</td>
                            <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">&nbsp;</td>
                            <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">&nbsp;</td>
                            <td className="text-[8px] sm:text-sm lg:text-base py-3 sm:py-2 lg:px-6 lg:py-4">&nbsp;</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}

export default SearchTable
