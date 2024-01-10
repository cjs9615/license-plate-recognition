import React from 'react'

const ModalImage = ({ imgUrl, marginT, title }) => {
    return (
        <div className={`flex gap-10 ${marginT}`}>
            <div className="w-[30%] md:w-[20%]">{title}</div>
            <div className="h-[150px] md:h-[200px] grow">
                <img src={imgUrl} className="w-full h-full object-fill" />
            </div>
        </div>
    )
}

export default ModalImage
