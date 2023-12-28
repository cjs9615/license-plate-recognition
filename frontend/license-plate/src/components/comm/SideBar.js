import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaTable, FaListUl } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { LoginStateAtom } from "../../pages/member/LoginStateAtom";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [menuItems, setMenuItems] = useState();
    const menuList = [
        ["/main", "MAIN", <FaTable />],
        ["/search", "SEARCH", <FaListUl />],
        ["/admin", "ADMIN", <FaScrewdriverWrench />]
    ];


    // 로그인 상태 변수
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginStateAtom);

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    }

    useEffect(() => {
        const menuItem = menuList.map((menu) => {
            if (location.pathname === menu[0]) {
                return (
                    <div key={`${menu[0]}Item`}>
                        <Link to={menu[0]}>
                            <div className="flex gap-5 justify-center items-center bg-[#F3F3F3] text-[#2E3D4E] font-bold h-[50px] md:justify-start md:px-[30px]">
                                {menu[2]}
                                <div className="hidden md:block">
                                    {menu[1]}
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            } else {
                return (
                    <div key={`${menu[0]}Item`}>
                        <Link to={menu[0]}>
                            <div className="transition-all flex gap-5 justify-center items-center h-[50px] md:justify-start md:px-[30px] hover:bg-[#F3F3F3] hover:text-[#2E3D4E] hover:font-bold">
                                {menu[2]}
                                <div className="hidden md:block">
                                    {menu[1]}
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            }

        })

        setMenuItems(menuItem);

    }, [])

    return (
        <aside className="relative bg-[#2E3D4E] text-white w-[79.2px] md:w-[249px] h-full">
            <div className="flex justify-center h-[150px]">
                <h1 className="text-xl m-auto">테스트</h1>
            </div>
            <div>
                {menuItems}
            </div>
            <div onClick={handleLogout} className="transition-all flex gap-5 justify-center items-center text-[#c0c0c0] h-[50px] md:justify-start md:px-[30px] mt-[1rem] hover:underline cursor-pointer">
                <FaSignOutAlt />
                <p className="hidden md:block">로그아웃</p>
            </div>
        </aside>
    )
}

export default SideBar
