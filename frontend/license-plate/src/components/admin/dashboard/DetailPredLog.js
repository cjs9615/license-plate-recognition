import { IoMdCloseCircleOutline } from "react-icons/io";
import PredGraph from "./PredGraph";
import { useEffect, useState } from "react";
import PredTable from "./PredTable";

const DetailPredLog = ({ setSelDashboard }) => {
  const [graphData, setGraphData] = useState();

  const handleModal = () => {
    setSelDashboard();
  }

  useEffect(() => {
    const url = "http://10.125.121.216:8080/api/techtri/admin/dashboard/detail/predict";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    })
      .then(resp => resp.json())
      .then(data => {
        console.log("추론기록 그래프 데이터 : ", data);
        setGraphData(data);
      })
      .catch(error => console.log(error));

  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white drop-shadow-lg rounded-lg w-[700px] h-[350px] md:h-[800px] p-5 overflow-auto">
        <div className="flex justify-center text-xl font-bold">
          <h1>추론 기록 통계</h1>
        </div>
        {
          graphData
            ?
            <div>
              <div className="mt-[2rem]">
                <h2 className="flex flex-col items-center font-bold">&lt;추론 기록 테이블&gt;</h2>
                <PredTable data={graphData} />
              </div>
              <div className="flex flex-col items-center justify-center w-full mt-[2rem] ">
                <h2 className="font-bold">&lt;오늘 추론 기록 통계 그래프&gt;</h2>
                <PredGraph label={['오늘']} successVal={[graphData.today.success]} failureVal={[graphData.today.fail]} />
                <h2 className="mt-[3.5rem] font-bold">&lt;전체 추론 기록 통계 그래프&gt;</h2>
                <PredGraph label={['전체']} successVal={[graphData.total.success]} failureVal={[graphData.total.fail]} />
              </div>
            </div>
            : ""
        }
        <div className=" absolute top-0 right-0 p-5">
          <button onClick={handleModal}>
            <IoMdCloseCircleOutline className="text-3xl" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default DetailPredLog
