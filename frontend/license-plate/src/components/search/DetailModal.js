import { useState } from "react";
const DetailModal = ({ setDetailNumber, title, children, onClose, detailData, setDetailData, seq, predictId }) => {

  const [tableData, setTableData] = useState([]);
  const [selectedData, setSelectedData] = useState();

  const handleItemClick = (id, plateNumber) => {

    setSelectedData([id, plateNumber]);
  }

  const handleClose = () => {
    onClose();
    window.location.reload();
  }

  const [isTableVisible, setIsTableVisible] = useState(false);

  const updateSubmit = () => {
    if (!selectedData) {
      alert("차량을 선택해주세요")
      return;
    }
    if (window.confirm(`차량번호를 "${selectedData[1]}"로 바꾸시겠습니까?`)) {
      const url = `http://10.125.121.216:8080/api/techtri/record/detail/${seq}?carId=${selectedData[0]}`
      console.log(url)
      fetch(url, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(resp => {
          if (resp.status === 200) {
            setDetailNumber(selectedData[1]);
            setTableData([]);
            setIsTableVisible(!isTableVisible);
          }
        })
        .catch(error => console.log(error));
    }


  }

  const handleUpdateInfo = () => {
    if (!isTableVisible) {
      const url = `http://10.125.121.216:8080/api/techtri/record/numbers?predictId=${predictId}`
      console.log(url)
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(resp => resp.json())
        .then(data => {
          setTableData(data);
          console.log(data)
        })
        .catch(error => console.log(error));
    }

    setIsTableVisible(!isTableVisible);
  }

  return (

    <div className="fixed inset-0 bg-[#2C3D4E] bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className={`border-[#2C3D4E] border-2 rounded-lg w-[35rem] ${isTableVisible ? "overflow-auto" : ""} lg:w-[50rem] lg:h-[26rem] min-w-[18rem] min-h-[20rem] bg-white shadow-2xl`}>
        <div className="flex justify-between w-full bg-[#2C3D4E]">
          <h3 className="text-[20px] pl-5 flex justify-start items-center text-white font-bold">작업기록 상세보기</h3>
          <button onClick={handleClose} className="w-[3rem] border-2 text-[#2C3D4E] bg-white border-[#2C3D4E] px-2 m-2 rounded-md text-xs font-bold hover:bg-gray-200">닫기</button>
        </div>
        <div className="text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="pt-3 text-black px-3">
          {children}
        </div>
        <div className="flex justify-center">
          <button onClick={handleUpdateInfo} className={`${isTableVisible ? "hover:bg-[#2C3D4E] hover:text-white" : "bg-[#2C3D4E] text-white hover:text-black hover:bg-[white]"} border-2 border-[#2C3D4E] text-center w-[7rem] mt-3 py-2 rounded-md text-xs`}>{isTableVisible ? "수정목록 닫기" : '차량번호 수정'}</button>
        </div>
        {isTableVisible && tableData.length > 0 && (
          <div className="flex-col flex items-center w-full h-fit mt-4">
            <h3 className="py-1 bg-[#2C3D4E] w-[90%] text-white font-bold text-xl text-center">수정 가능한 차량번호</h3>
            <table className="border-2 border-gray-300 w-[90%] text-sm text-center text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-12 py-1">No.</th>
                  <th scope="col" className="px-12 py-1">차량번호</th>
                  <th scope="col" className="px-12 py-1">날짜</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((plate, index) => (
                  <tr key={plate.id} onClick={() => handleItemClick(plate.id, plate.plateNumber)}
                    className={`border-b cursor-pointer hover:bg-gray-200 ${selectedData && plate.id === selectedData[0] ? "bg-[#2C3D4E] animate-pulse text-white" : ""}`}>
                    <td className="px-12 py-1">{index + 1}</td>
                    <td className="px-12 py-1">{plate.plateNumber}</td>
                    <td className="px-12 py-1">{plate.regiDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-2">
              <button onClick={updateSubmit} className="w-[8rem] my-4 border-2 border-[#2C3D4E] rounded text-white bg-[#2C3D4E] hover:border-[#3c536b] hover:bg-[#3c536b]">저장</button>
            </div>
          </div>
        )
        }
      </div>
    </div>
  );
};

export default DetailModal;