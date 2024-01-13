import { IoMdCloseCircleOutline } from "react-icons/io";
import WorkGraph from "./WorkGraph";
import { useEffect, useState } from "react";

const DetailWorkInfo = ({ setSelDashboard }) => {
  const [graphData, setGraphData] = useState();

  const getYear = () => {
    return new Date().getFullYear();
  }
  const handleModal = () => {
    setSelDashboard();
  }

  useEffect(() => {
    const url = "http://10.125.121.216:8080/api/techtri/admin/dashboard/detail/work";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    })
      .then(resp => resp.json())
      .then(data => {
        setGraphData(data);
      })
      .catch(error => console.log(error));

  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white drop-shadow-lg rounded-lg w-[700px] h-[350px] md:h-[430px] p-5">
        <div className="flex justify-center text-xl font-bold">
          <h1>{getYear()}년 고철장 작업 통계</h1>
        </div>
        {
          graphData && graphData
            ?
            <div className="flex flex-col items-center justify-center w-full mt-[2rem] ">
              <h2 className="font-bold">&lt;월간 작업량 그래프&gt;</h2>
              <WorkGraph values={graphData} />
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

export default DetailWorkInfo
