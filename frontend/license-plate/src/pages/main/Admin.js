import React, { useEffect, useState } from "react"
import SideBar from "../../components/comm/SideBar"
import TruckInfo from "../../components/admin/truckInfo/TruckInfo";
import PredLog from "../../components/admin/predLog/PredLog";
import Dashboard from "../../components/admin/dashboard/Dashboard";
import { AiOutlineDatabase } from "react-icons/ai";
import { RiTruckLine } from "react-icons/ri";
import { MdDataSaverOff } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import DetailPredLog from "../../components/admin/dashboard/DetailPredLog";
import DetailWorkInfo from "../../components/admin/dashboard/DetailWorkInfo";

const API_URL = 'http://10.125.121.216:8080/api/techtri/admin/dashboard';
const UNAUTHORIZED_PATH = '/unauthorized';

const Admin = () => {
    const [truckInfoClick, setTruckInfoClick] = useState(true);
    const [predLogClick, setPredLogClick] = useState(false);

    // 대시보드 데이터 변수
    const [totalCarCount, setTotalCarCount] = useState(0);
    const [registeredCarCount, setRegisteredCarCount] = useState(0);
    const [dailyPred, setDailyPred] = useState(0);
    const [thisMonthRecord, setThisMonthRecord] = useState(0);
    const [selDashboard, setSelDashboard] = useState();

    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);


    const showTruckInfo = () => {
        setTruckInfoClick(true);
        setPredLogClick(false);
    }

    const showLog = () => {
        setTruckInfoClick(false);
        setPredLogClick(true);
    }

    useEffect(() => {
        // 대시보드 데이터 받아오기
        const fetchData = async () => {
            try {
                const isMember = localStorage.getItem("token");
                if (!isMember) {
                    alert("로그인 후 이용해주세요");
                    navigate("/");
                    return;
                }

                const response = await fetch(API_URL, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });

                if (response.status === 403) {
                    navigate(UNAUTHORIZED_PATH);
                    return;
                }

                const data = await response.json();
                setTotalCarCount(data.totalCarCount);
                setRegisteredCarCount(data.todayRegisteredCarCount);
                setDailyPred(data.todayPredict);
                setThisMonthRecord(data.thisMonthRecord);
                setIsAuthorized(true);
            } catch (error) {
                console.log("Error fetching Data :", error);
            }
        }

        fetchData();
    }, [])

    // 로그인 확인 또는 인가 상태 확인 중에는 아무것도 렌더링하지 않음
    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="flex justify-between items-center border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">ADMIN</h1>
                    <div className="flex gap-2">
                        {
                            truckInfoClick
                                ? <p className="transition-all text-[#2E3D4E] font-bold cursor-pointer bg-gray-200 rounded-md p-2">차량관리</p>
                                : <button onClick={showTruckInfo} className="transition-all text-[#A1A1A1] font-bold  hover:bg-[#2E3D4E] hover:text-white hover:rounded-md p-2">차량관리</button>
                        }
                        {
                            predLogClick
                                ? <p className="transition-all text-[#2E3D4E] font-bold cursor-pointer p-2 bg-gray-200 rounded-md">추론기록</p>
                                : <button onClick={showLog} className="transition-all text-[#A1A1A1] font-bold hover:bg-[#2E3D4E] hover:text-white hover:rounded-md  p-2">추론기록</button>
                        }
                    </div>
                </div>
                <div className="mt-[1rem]">
                    <h2 className="text-lg font-bold">Dashboard</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
                        <Dashboard bgColor="bg-[#FF9F1C]" title="전체 등록차량 수" value={totalCarCount} icon={<AiOutlineDatabase />} setSelDashboard={setSelDashboard} />
                        <Dashboard bgColor="bg-[#4360F0]" title="일일 신규차량 등록 수" value={registeredCarCount} icon={<RiTruckLine />} setSelDashboard={setSelDashboard} />
                        <Dashboard bgColor="bg-[#FF6A6B]" title="일일 추론 횟수" value={dailyPred.fail + dailyPred.success} detail1={`성공 : ${dailyPred.success}`} detail2={`실패 : ${dailyPred.fail}`} icon={<MdDataSaverOff />} hover={'hover:scale-105 cursor-pointer'} setSelDashboard={setSelDashboard} />
                        <Dashboard bgColor="bg-[#4DCDC4]" title="월간 고철장 작업 통계" value={thisMonthRecord} icon={<VscGraph />} setSelDashboard={setSelDashboard} hover={'hover:scale-105 cursor-pointer'} />
                    </div>
                </div>
                {
                    truckInfoClick
                        ? <TruckInfo />
                        : <PredLog />
                }
                {
                    selDashboard && selDashboard === "일일 추론 횟수"
                    ? <DetailPredLog setSelDashboard={setSelDashboard} />
                    : selDashboard === "월간 고철장 작업 통계"
                    ? <DetailWorkInfo setSelDashboard={setSelDashboard} />
                    : ""
                }
            </div>
        </div>
    )
}

export default Admin
