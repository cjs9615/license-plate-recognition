import SideBar from "../../components/comm/SideBar"

const Search = () => {
    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                <div className="border-b-2 border-black py-[0.5rem]">
                    <h1 className="text-[24px] font-bold">SEARCH</h1>
                </div>
            </div>
        </div>
    )
}

export default Search
