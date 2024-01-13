import React from 'react'

const PredTable = ({data}) => {
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className=" min-w-full text-center text-sm font-light">
                            <thead className="border-b font-medium">
                                <tr className='bg-gray-200'>
                                    <th scope="col" class="bg-white px-5 py-3 border-r w-[80px]"></th>
                                    <th scope="col" class=" px-5 py-3 border-r border-r-white">성공</th>
                                    <th scope="col" class=" px-5 py-3 ">실패</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-r">
                                    <td className="bg-gray-200 px-5 py-3 font-bold border-r border-b-white">전체</td>
                                    <td className="px-5 py-3 border-r">{data.total.success}</td>
                                    <td className="px-5 py-3">{data.total.fail}</td>
                                </tr>
                                <tr className='border-b'>
                                    <td className="bg-gray-200 px-5 py-3 font-bold border-t border-r border-t-white ">오늘</td>
                                    <td className="px-5 py-3 border-r">{data.today.success}</td>
                                    <td className="px-5 py-3 border-r">{data.today.fail}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PredTable
