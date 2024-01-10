import { useState } from "react"
import SideBar from "../../components/comm/SideBar"
import "../../components/comm/react-paginate.css"
import SearchDate from "../../components/search/SearchDate"
import SearchNumber from "../../components/search/SearchNumber"


const Search = () => {
    const [searchDate, setSearchDate] = useState(false);
    const [searchNumber, setSearchNumber] = useState(true);

    const handleSearchDate = () => {
        setSearchDate(true);
        setSearchNumber(false);
    }

    const handleSearchNumber = () => {
        setSearchDate(false);
        setSearchNumber(true);
    }


    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">SEARCH</h1>
                </div>
                <div className="flex mb-2">
                    {
                        searchDate
                            ? <p className={`text-blue-500 text-center pt-2 lg:pt-4 sm:w-[4rem] md:w-[3rem] lg:w-[5rem] w-[2.5rem] lg:p-2 text-[9px] sm:text-sm md:text-[12px] lg:text-base font-bold `}>날짜</p>
                            : <button
                                onClick={handleSearchDate}
                                className={`text-center pt-2 lg:pt-4 sm:w-[4rem] md:w-[3rem] lg:w-[5rem] w-[2.5rem] lg:p-2 text-[9px] sm:text-sm md:text-[12px] lg:text-base font-bold `} >날짜</button>

                    }
                    {
                        searchNumber
                            ? <p className={`text-blue-500 pt-2 lg:pt-4 sm:w-[4rem] md:w-[3rem] lg:w-[5rem] w-[2.5rem] lg:p-2 text-[9px] sm:text-sm md:text-[12px] lg:text-base font-bold `}>차량번호</p>
                            : <button
                                onClick={handleSearchNumber}
                                className={`pt-2 lg:pt-4 sm:w-[4rem] md:w-[3rem] lg:w-[5rem] w-[2.5rem] lg:p-2 text-[9px] sm:text-sm md:text-[12px] lg:text-base font-bold `} >차량번호</button>
                    }

                    <div className="text-[7px] pt-2 flex pl-4 items-center sm:text-xs text-gray-300">← 검색할 항목을 선택해주세요</div>
                </div>
                <div className="">
                    {
                        searchDate
                            ? <SearchDate />
                            : <SearchNumber />
                    }
                </div>
            </div>
        </div>
    )
}

export default Search
