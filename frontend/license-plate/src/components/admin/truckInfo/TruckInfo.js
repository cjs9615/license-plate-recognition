import { useEffect, useRef, useState } from "react"
import { MdAddToPhotos } from "react-icons/md";
import Pagination from "react-js-pagination";
import '../react-paginate.css';
import TruckList from "./TruckList";
import AddTruckModal from "./AddTruckModal";

const TruckInfo = () => {
  // 차량번호
  const numberRef = useRef();
  
  // 검색 결과
  const [searchData, setSearchData] = useState([]);
  
  // 페이징
  const [page, setPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);

  // 차량 추가 모달
  const [addModalOpen, setAddModalOpen] = useState(false);

  // 모달 오픈
  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  }

  const searchTruck = () => {

    const targetNumber = {
      searchCondition: "number",
      number: numberRef.current.value
    }

    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(targetNumber)
    };

    fetch('http://10.125.121.216:8080/api/techtri/admin/car/1', data)
      .then(resp => resp.json())
      .then(data => {
        // console.log(data);
        setPage(1);
        setSearchData(data.content);
        setTotalNum(data.totalElements);
      })
      .catch(err => console.log(err));
  }

  // 엔터키 이벤트
  const enterKeyDown = (e) => {
    if (e.key == "Enter") {
      searchTruck();
    }
  }

  const handlePageChange = (page) => {
    setPage(page);
  }

  // 페이지 변경시 게시물 리스트 받아오기
  useEffect(() => {
    let obj;

    if (!numberRef.current.value) {
      obj = { searchCondition: "total" }
    } else {
      obj = {
        searchCondition: "number",
        number: numberRef.current.value
      }
    }

    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    };

    fetch(`http://10.125.121.216:8080/api/techtri/admin/car/${page}`, data)
      .then(resp => resp.json())
      .then(data => {
        // console.log("페이징 데이터 : ", data);
        setSearchData(data.content);
        setTotalNum(data.totalElements);
      })
      .catch(err => console.log(err));

  }, [page])

  // 처음 전체 게시물 리스트 받아오기
  useEffect(() => {

    const obj = { searchCondition: "total" }

    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    };

    fetch('http://10.125.121.216:8080/api/techtri/admin/car/1', data)
      .then(resp => resp.json())
      .then(data => {
        // console.log("데이터 : ", data);
        setSearchData(data.content);
        setTotalNum(data.totalElements);
      })
      .catch(err => console.log(err));


  }, [])

  return (
    <div className=" mt-[1rem] md:mt-[1.5rem]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">차량관리</h2>
        <div
          onClick={handleAddModalOpen}
          className="flex justify-center gap-1 items-center rounded-full transition-all text-[#008E93] active:text-[#103c49] md:active:text-white md:bg-[#008E93] md:active:bg-[#103c49] md:text-white md:w-[100px] h-[28px]  cursor-pointer">
          <MdAddToPhotos className="text-3xl md:text-base" />
          <p className="hidden md:block text-sm">ADD</p>
        </div>
      </div>
      <div className="flex gap-2 items-center mt-[1rem]">
        <input
          type="text"
          ref={numberRef}
          onKeyDown={enterKeyDown}
          placeholder="차량번호를 입력해주세요"
          className="border-none bg-[#DBDBDB] w-[230px] h-[42px] md:w-[280px] " />
        <button
          onClick={searchTruck}
          className="transition-all bg-[#1D647A] text-white active:bg-[#103c49] w-[67px] h-[42px]">
          검색
        </button>
      </div>
      <div className="mt-[1rem] mb-[1rem]">
        {
          searchData && searchData
            ? <TruckList searchData={searchData} page={page} />
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
        addModalOpen
        ? <AddTruckModal setAddModalOpen={setAddModalOpen} />
        : ""
      }
    </div>
  )
}

export default TruckInfo
