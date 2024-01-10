import { useEffect, useRef, useState } from "react"
import Pagination from "react-js-pagination";
import SearchTable from "../../components/search/SearchTable";
import DetailModal from "./DetailModal";
import { useNavigate } from "react-router-dom";

const SearchNumber = () => {

    // Ref 변수 선언
    const numberRef = useRef();
    // 데이터 관련
    const [currentItems, setCurrentItems] = useState([]);

    // 페이징
    const [page, setPage] = useState(1);
    const [totalNum, setTotalNum] = useState(0);

    const handlePageChange = (page) => {
        setPage(page);
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [detailData, setDetailData] = useState(null);

    const emptyRows = () => {

    }

    const onRowClick = (seq) => {
        fetch(`http://10.125.121.216:8080/api/techtri/record/detail/${seq}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        })
            .then(resp => resp.json())
            .then(data => {
                console.log("받은 데이터: ", data)
                setDetailData(data);
                setModalVisible(true);
            })
            .catch(error => console.error("Error fetching details: ", error))
    }

    // 페이지가 바뀔때마다 실행
    useEffect(() => {
        let obj;

        if (numberRef.current.value === "") {
            obj = {
                searchCondition: "total",
            }
        } else {
            obj = {
                searchCondition: "number",
                number: numberRef.current.value
            }
        }

        const data = {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)

        }
        fetch(`http://10.125.121.216:8080/api/techtri/record/${page}`, data)
            .then(resp => resp.json())
            .then(data => {
                setCurrentItems(data.content)
                setTotalNum(data.totalElements)
            })
            .catch(error => console.log(error))
    }, [page])

    // 번호로 검색하기
    const handleSearchNumber = () => {

        const obj = {
            searchCondition: "number",
            number: numberRef.current.value
        }

        const data = {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)

        }
        fetch(`http://10.125.121.216:8080/api/techtri/record/1`, data)
            .then(resp => resp.json())
            .then(data => {
                console.log("검색한 데이터: ", data);
                setPage(1);
                setCurrentItems(data.content)
                setTotalNum(data.totalElements)
            })
            .catch(error => console.log(error))
    }

    // 서치에 제일 처음 들어왔을 때
    useEffect(() => {
        const obj = {
            searchCondition: "total",
        }

        const data = {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)

        }
        fetch(`http://10.125.121.216:8080/api/techtri/record/1`, data)
            .then(resp => resp.json())
            .then(data => {
                // console.log("데이터 : ", data)
                setCurrentItems(data.content)
                setTotalNum(data.totalElements)
            })
            .catch(error => console.log(error))
    }, [])

    return (
        <div className="w-full h-full">
            <div className="w-full h-[2rem] sm:h-[2rem]">
                <input
                    ref={numberRef}
                    type="text"
                    className="text-xs sm:text-sm lg:text-base bg-gray-200 border-2 border-gray-200 w-[12rem] sm:w-[17.1rem]"
                    placeholder="차량번호를 입력해주세요"
                />
                <button onClick={handleSearchNumber} className="text-xs sm:text-sm lg:text-base ml-2 lg:ml-[14px] sm:pt-[8px] sm:pb-[7px] sm:ml-[15px] py-2 lg:p-2 w-[3rem] sm:w-[4rem] lg:w-[5rem] text-white border-2 border-[#1D647A] bg-[#1D647A]">검색</button>
            </div>
            <div className="mt-[2rem]">
                <SearchTable currentItems={currentItems} page={page} onRowClick={onRowClick} emptyRows={emptyRows} />
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
                    <div className="sm:flex gap-6 mx-4">
                        {detailData.images.filter(image => image.type === "pre-prediction").map((image, index) => (
                            <div key={index}>

                                <img className="bg-white mt-4 border-2 border-gray-300 sm:w-[19rem] sm:h-[15rem] lg:w-[50rem] lg:h-[18.4rem]" src={image.url} alt={`이미지 ${index}`} />
                            </div>
                        ))}
                        <div className="my-4 border-2 border-gray-200 rounded-md bg-white">
                            <div className="h-[25%] flex-col flex items-center lg:text-base"><pre className="bg-[#2C3D4E] text-white text-center sm:w-[10rem] lg:w-[12rem] text-[10px] lg:text-xs border-b-2 lg:py-[6px] border-gray-300 lg:font-bold" >날짜</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.timestamp.split("T")[0]}</p></div>
                            <div className="h-[25%] flex-col flex items-center lg:text-base"><pre className="bg-[#2C3D4E] text-white text-center sm:w-[10rem] lg:w-[12rem] text-[10px] lg:text-xs border-b-2 lg:py-[6px] border-gray-300 lg:font-bold" >시간</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.timestamp.split("T")[1].split(".")[0]}</p></div>
                            <div className="h-[25%] flex-col flex items-center lg:text-base"><pre className="bg-[#2C3D4E] text-white text-center sm:w-[10rem] lg:w-[12rem] text-[10px] lg:text-xs border-b-2 lg:py-[6px] border-gray-300 lg:font-bold" >차량번호</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.plateNumber}</p></div>
                            <div className="h-[25%] flex-col flex items-center lg:text-base"><pre className="bg-[#2C3D4E] text-white text-center sm:w-[10rem] lg:w-[12rem] text-[10px] lg:text-xs lg:py-[6px] lg:font-bold" >작성자</pre> <p className="flex items-center justify-center grow w-full">{detailData.detail.writer}</p></div>
                        </div>
                    </div>
                </DetailModal>}
            </div>
        </div>
    )
}

export default SearchNumber
