
const ResultImage = ({ mdH, imgUrl }) => {
    return (
        <div className={`bg-[#e2e2e2] rounded-b-md h-[200px] ${mdH}`}>
            <img src={imgUrl} className="object-fit w-full h-full" alt="carImage"/>
        </div>
    )
}

export default ResultImage
