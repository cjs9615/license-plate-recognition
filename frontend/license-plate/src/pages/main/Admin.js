import SideBar from "../../components/comm/SideBar"

const Admin = () => {
    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="flex justify-between items-center border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">ADMIN</h1>
                    <div className="flex gap-2">
                        <button>차량정보</button>
                        <button>추론결과</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin
