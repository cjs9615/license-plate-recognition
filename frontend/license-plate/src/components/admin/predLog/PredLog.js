import { useEffect, useRef, useState } from "react";
import Pagination from "react-js-pagination";
import PredLogList from "./PredLogList";
import PredInfoModal from "./PredInfoModal"

const PredLog = () => {
  const targetDate = useRef();
  const [predLogData, setPredLogData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selPredId, setSelPredId] = useState();

  // 페이지 이동
  const handlePageChange = (page) => {
    setPage(page);
  }

  const searchPredLog = () => {
    fetch(`http://10.125.121.216:8080/api/techtri/admin/predict/${page}?date=${targetDate.current.value}`)
      .then(resp => resp.json())
      .then(data => {
        setPage(1);
        setPredLogData(data.content);
        setTotalNum(data.totalElements);
      })
      .catch(err => console.log(err));

  }

  // 페이지 이동할 때
  useEffect(() => {

    fetch(`http://10.125.121.216:8080/api/techtri/admin/predict/${page}?date=${targetDate.current.value}`)
      .then(resp => resp.json())
      .then(data => {
        // console.log("추론기록 데이터 ", data);
        setPredLogData(data.content);
        setTotalNum(data.totalElements);
      })
      .catch(err => console.log(err));

  }, [page])

  useEffect(() => {
    fetch('http://10.125.121.216:8080/api/techtri/admin/predict/1?date=')
      .then(resp => resp.json())
      .then(data => {
        // console.log("추론기록 데이터 ", data);
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
            ? <PredLogList predLogData={predLogData} page={page} setInfoModalOpen={setInfoModalOpen} setSelPredId={setSelPredId}/>
            : "테스트"
        }
        <Pagination
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalNum}
          pageRangeDisplayed={5}
          onChange={handlePageChange} />
      </div>
      {
        infoModalOpen
        ? <PredInfoModal setInfoModalOpen={setInfoModalOpen} selPredId={selPredId}/>
        : ""
      }
    </div>
  )
}

export default PredLog
