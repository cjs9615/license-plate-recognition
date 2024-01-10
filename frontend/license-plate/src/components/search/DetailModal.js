const DetailModal = ({ title, children, onClose }) => {
  return (

    <div className="fixed inset-0 bg-[#2C3D4E] bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="border-[#2C3D4E] border-2 rounded-lg w-[35rem] h-fit lg:w-[50rem] lg:h-[25rem] min-w-[18rem] min-h-[20rem] bg-white shadow-2xl overflow-auto">
        <div className="flex justify-between w-full bg-[#2C3D4E]">
          <div className="text-[20px] pl-5 flex justify-start items-center text-white font-bold">작업기록 상세보기</div>
          <button onClick={onClose} className="w-[2rem] border-2 text-[#2C3D4E] bg-white border-[#2C3D4E] px-2 m-2 rounded-md text-xs font-bold hover:bg-gray-100">X</button>
        </div>
        <div className="text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="pt-3 text-black px-3">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DetailModal;