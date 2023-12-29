import { useState } from "react"
import SideBar from "../../components/comm/SideBar"
import TruckInfo from "../../components/admin/TruckInfo";
import PredLog from "../../components/admin/PredLog";
const Admin = () => {
    const [truckInfoClick, setTruckInfoClick] = useState(true);
    const [predLogClick, setPredLogClick] = useState(false);

    const showTruckInfo = () => {
        setTruckInfoClick(true);
        setPredLogClick(false);
    }

    const showLog = () => {
        setTruckInfoClick(false);
        setPredLogClick(true);
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
                                ? <p className="text-[#2E3D4E] font-bold cursor-pointer">차량관리</p>
                                : <button onClick={showTruckInfo} className="text-[#A1A1A1] font-bold hover:underline">차량정보</button>
                        }
                        {
                            predLogClick
                                ? <p className="text-[#2E3D4E] font-bold cursor-pointer">추론결과</p>
                                : <button onClick={showLog} className="text-[#A1A1A1] font-bold hover:underline">추론결과</button>
                        }
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
