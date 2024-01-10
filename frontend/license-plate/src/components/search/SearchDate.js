import Pagination from "react-js-pagination"
import SearchTable from "./SearchTable"
import { useEffect, useRef, useState } from "react"
import DetailModal from "./DetailModal";


const SearchDate = () => {

    // const Authorization = localStorage.getItem("token")

    // Ref 변수 선언
    const fromDateRef = useRef();
    const toDateRef = useRef();

    // 페이징
    const [page, setPage] = useState(1);
    const [totalNum, setTotalNum] = useState(0);

    const [currentItems, setCurrentItems] = useState([]);

    const handleFromDateChange = () => {
        if (fromDateRef.current && toDateRef.current) {
            toDateRef.current.min = fromDateRef.current.value;
        }
    };

    const handleToDateChange = () => {
        if (toDateRef.current && fromDateRef.current) {
            fromDateRef.current.max = toDateRef.current.value;
        }
    }

    const handlePageChange = (page) => {
        setPage(page);
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [detailData, setDetailData] = useState(null);

    const onRowClick = (seq) => {
        fetch(`http://10.125.121.216:8080/api/techtri/record/detail/${seq}`)
            .then(resp => resp.json())
            .then(data => {
                console.log("받은 데이터: ", data)
                setDetailData(data);
                setModalVisible(true);
            })
            .catch(error => console.error("Error fetching details: ", error))
    }

    useEffect(() => {
        console.log(page)
    }, [page])


    // 페이지가 바뀔때 마다
    useEffect(() => {

        let obj;

        if (!fromDateRef.current.value || !toDateRef.current.value) {
            obj = { searchCondition: "total" }
        } else {
            obj = {
                searchCondition: "date",
                fromDate: fromDateRef.current.value + " 00:00:00",
                toDate: toDateRef.current.value + " 23:59:59",
            }
        }

        const data = {
            method: "POST",
            headers: {
                // "Authorization": Authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj),
        }

        fetch(`http://10.125.121.216:8080/api/techtri/record/${page}`, data)
            .then(resp => resp.json())
            .then(data => {
                setCurrentItems(data.content)
                setTotalNum(data.totalElements)
            })
            .catch(error => console.log(error))
    }, [page])

    // 날짜로 검색하기
    const handleSearchDate = () => {
        const obj = {
            searchCondition: "date",
            fromDate: fromDateRef.current.value + " 00:00:00",
            toDate: toDateRef.current.value + " 23:59:59",
        }

        const data = {
            method: "POST",
            headers: {
                // "Authorization": Authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        }

        fetch(`http://10.125.121.216:8080/api/techtri/record/1`, data)
            .then(resp => resp.json())
            .then(data => {
                setPage(1);
                setCurrentItems(data.content);
                setTotalNum(data.totalElements);
            })
            .catch(error => console.log(error))
    }
    // 날짜 별 검색을 눌렀을 때 초기에 불러올 데이터
    useEffect(() => {
        const obj = {
            searchCondition: "total"
        }

        const data = {
            method: "POST",
            headers: {
                // "Authorization": Authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }

        fetch("http://10.125.121.216:8080/api/techtri/record/1", data)
            .then(resp => resp.json())
            .then(data => {
                setCurrentItems(data.content);
                setTotalNum(data.totalElements)
            })
            .catch(error => console.log("에러 발생!!", error))
    }, [])

    return (
        <div className="w-full h-full">
            <div className="flex-col text-center sm:text-start sm:flex-none w-full h-[3rem] sm:h-[2rem] sm:space-x-4">
                <input className="mx-2 sm:mx-0 text-[8px] sm:text-sm h-[2rem] sm:h-[2.5rem] w-[40%] lg:text-base sm:w-[10rem]" onChange={handleFromDateChange} ref={fromDateRef} type="date" />
                <input className="mx-2 sm:mx-0 text-[8px] sm:text-sm h-[2rem] sm:h-[2.5rem] w-[40%] lg:text-base sm:w-[10rem]" onChange={handleToDateChange} ref={toDateRef} type="date" />
                <button onClick={handleSearchDate} className=" text-xs sm:text-sm lg:text-base w-full sm:w-[4rem] lg:w-[5rem] mt-[12px] sm:mt-0 sm:pt-[8px] sm:pb-[7px] lg:p-2 text-white border-2 border-[#1D647A] bg-[#1D647A]" >검색</button>
            </div>
            <div className="mt-[2rem]">
                <SearchTable currentItems={currentItems} page={page} onRowClick={onRowClick} />
            </div>
            <div className="mt-[2rem]">
                <Pagination
                    activePage={page}
                    itemCountPerPage={10}
                    totalItemsCount={totalNum}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                />
                {modalVisible && <DetailModal title="" onClose={() => setModalVisible(false)}>
                    <div className="flex gap-6 mx-4">
                        {detailData.images.filter(image => image.type === "pre-prediction").map((image, index) => (
                            <div key={index}>
                                
                                <img className="bg-white mt-4 border-2 border-gray-300" src={image.url} alt={`이미지 ${index}`} />
                            </div>
                        ))}
                        <div className="mt-4 border-2 border-gray-200 rounded-md bg-white">
                            <div className="h-[25%] flex-col flex items-center text-base"><pre className="bg-[#2C3D4E] text-white text-center w-[12rem] border-b-2 lg:text-xs py-[6px] border-gray-300 font-bold" >날짜</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.timestamp.split("T")[0]}</p></div>
                            <div className="h-[25%] flex-col flex items-center text-base"><pre className="bg-[#2C3D4E] text-white text-center w-[12rem] border-b-2 lg:text-xs py-[6px] border-gray-300 font-bold" >시간</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.timestamp.split("T")[1].split(".")[0]}</p></div>
                            <div className="h-[25%] flex-col flex items-center text-base"><pre className="bg-[#2C3D4E] text-white text-center w-[12rem] border-b-2 lg:text-xs py-[6px] border-gray-300 font-bold" >차량번호</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.plateNumber}</p></div>
                            <div className="h-[25%] flex-col flex items-center text-base"><pre className="bg-[#2C3D4E] text-white text-center w-[12rem] lg:text-xs py-[6px] font-bold" >작성자</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.writer}</p></div>
                        </div>
                    </div>
                </DetailModal>}
            </div>
        </div>
    )
}

export default SearchDate
