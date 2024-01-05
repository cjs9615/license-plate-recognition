import { useEffect, useState } from "react"
import SideBar from "../../components/comm/SideBar"
import TruckInfo from "../../components/admin/truckInfo/TruckInfo";
import PredLog from "../../components/admin/predLog/PredLog";
import Dashboard from "../../components/admin/Dashboard";

import { AiOutlineDatabase } from "react-icons/ai";
import { RiTruckLine } from "react-icons/ri";
import { MdDataSaverOff } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

const Admin = () => {
    const [truckInfoClick, setTruckInfoClick] = useState(true);
    const [predLogClick, setPredLogClick] = useState(false);

    // 대시보드 데이터 변수
    const [totalCarCount, setTotalCarCount] = useState(0);
    const [registeredCarCount, setRegisteredCarCount] = useState(0);
    const [dailyPred, setDailyPred] = useState(0);
    const [thisMonthRecord, setThisMonthRecord] = useState(0);

    const showTruckInfo = () => {
        setTruckInfoClick(true);
        setPredLogClick(false);
    }

    const showLog = () => {
        setTruckInfoClick(false);
        setPredLogClick(true);
    }

    // 대시보드 데이터 받아오기
    useEffect(() => {
        fetch('http://10.125.121.216:8080/api/techtri/admin/dashboard')
        .then(resp => resp.json())
        .then(data => {
            // console.log(data.todayPredict);
            setTotalCarCount(data.totalCarCount);
            setRegisteredCarCount(data.todayRegisteredCarCount);
            setDailyPred(data.todayPredict);
            setThisMonthRecord(data.thisMonthRecord);
        })
        .catch(err => console.log(err));
        
    }, [])

    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="flex justify-between items-center border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">ADMIN</h1>
                    <div className="flex gap-2">
                        {
                            truckInfoClick
                                ? <p className="text-[#2E3D4E] font-bold cursor-pointer">차량관리</p>
                                : <button onClick={showTruckInfo} className="text-[#A1A1A1] font-bold hover:underline">차량관리</button>
                        }
                        {
                            predLogClick
                                ? <p className="text-[#2E3D4E] font-bold cursor-pointer">추론기록</p>
                                : <button onClick={showLog} className="text-[#A1A1A1] font-bold hover:underline">추론기록</button>
                        }
                    </div>
                </div>
                <div className="mt-[1rem]">
                    <h2 className="text-lg font-bold">Dashboard</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
                        <Dashboard bgColor="bg-[#FF9F1C]" title="전체 등록차량 수" value={totalCarCount} icon={<AiOutlineDatabase />} />
                        <Dashboard bgColor="bg-[#4360F0]" title="일일 등록차량 수" value={registeredCarCount} icon={<RiTruckLine />} />
                        <Dashboard bgColor="bg-[#FF6A6B]" title="일일 추론 횟수" value={dailyPred.fail + dailyPred.success} detail1={`성공 : ${dailyPred.success}`} detail2={`실패 : ${dailyPred.fail}`} icon={<MdDataSaverOff />} />
                        <Dashboard bgColor="bg-[#4DCDC4]" title="월간 작업 통계" value={thisMonthRecord} icon={<VscGraph />} />
                    </div>
                </div>
                {
                    truckInfoClick
                        ? <TruckInfo />
                        : <PredLog />
                }
            </div>
        </div>
    )
}

export default Admin
