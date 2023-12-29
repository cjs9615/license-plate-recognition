import { useEffect, useRef, useState } from "react"
import testData from "../../testData.json"
import { MdAddToPhotos } from "react-icons/md";


const TruckInfo = () => {
  // 차량번호
  const numberRef = useRef();

  // 검색 결과
  const [data, setData] = useState();

  const searchTruck = () => {
    setData(testData);
  }

  // 엔터키 이벤트
  const enterKeyDown = (e) => {
    if (e.key == "Enter") {
      searchTruck();
    }
  }

  return (
    <div className=" mt-[1rem] md:mt-[1.5rem]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">차량관리</h2>
        <div
          className="flex justify-center gap-1 items-center rounded-full transition-all text-[#008E93] active:text-[#103c49] md:active:text-white md:bg-[#008E93] md:active:bg-[#103c49] md:text-white md:w-[100px] h-[28px]">
          <MdAddToPhotos className="text-3xl md:text-base" />
          <p className="hidden md:block text-sm">ADD</p>
        </div>
      </div>
      <div className="flex gap-2 items-center mt-[1rem]">
        <input
          type="text"
          ref={numberRef}
          onKeyDown={enterKeyDown}
          placeholder="차량번호 4자리를 입력해주세요"
          className="border-none bg-[#DBDBDB] w-[230px] h-[42px] md:w-[280px] " />
        <button
          onClick={searchTruck}
          className="transition-all bg-[#1D647A] text-white active:bg-[#103c49] w-[67px] h-[42px]">
          검색
        </button>
      </div>
      <div className="bg-blue-100 mt-[1rem]">
        
      </div>
    </div>
  )
}

export default TruckInfo
