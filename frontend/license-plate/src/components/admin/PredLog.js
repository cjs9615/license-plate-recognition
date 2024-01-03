import { useEffect, useRef, useState } from "react";
import Pagination from "react-js-pagination";
import PredLogList from "./PredLogList";

const PredLog = () => {
  const targetDate = useRef();
  const [predLogData, setPredLogData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);

  // 페이지 이동할 때 데이터 받아오기 (useEffect)
  // 날짜로 검색하기
  // 검색했다가 초기화는 어떻게 할지 생각해보기 (날짜 고르는 곳에 삭제가 있긴 있음)
  // 추론결과 리스트에 어떤 정보 보여줄지 생각하기

  // 페이지 이동
  const handlePageChange = (page) => {
    setPage(page);
  }

  const searchPredLog = () => {
    // 초기화는 어떻게 하지..
    if (targetDate.current.value === "") {
      alert("날짜를 선택해주세요");
      return;
    }

  }

  useEffect(() => {
    fetch('http://10.125.121.216:8080/api/techtri/admin/predict/1?date=')
      .then(resp => resp.json())
      .then(data => {
        console.log("추론기록 데이터 ", data);
        setPredLogData(data.content);
        setTotalNum(data.totalElements);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="mt-[1rem] md:mt-[1.5rem]">
      <h2 className="text-lg font-bold">추론결과</h2>
      <div className="flex gap-2 items-center mt-[1rem]">
        <input
          type="date"
          ref={targetDate}
          placeholder="차량번호를 입력해주세요"
          className="border-none bg-[#DBDBDB] w-[230px] h-[42px] md:w-[280px] " />
        <button
          onClick={searchPredLog}
          className="transition-all bg-[#1D647A] text-white active:bg-[#103c49] w-[67px] h-[42px]">
          검색
        </button>
      </div>
      <div className="mt-[1rem] mb-[1rem]">
        {
          predLogData && predLogData
            ? <PredLogList predLogData={predLogData} page={page} />
            : "테스트"
        }
        <Pagination
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalNum}
          pageRangeDisplayed={5}
          onChange={handlePageChange} />
      </div>
    </div>
  )
}

export default PredLog
