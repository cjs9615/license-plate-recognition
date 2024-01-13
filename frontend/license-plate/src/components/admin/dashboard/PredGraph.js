import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from "chart.js";

import { Line } from "react-chartjs-2";

const PredGraph = ({label, successVal, failureVal}) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,

    );

    const data = {
        labels: label,
        datasets: [
            {
                type: 'bar',
                label: '성공',
                backgroundColor: 'rgb(72, 139, 239)',
                data: successVal,
            },
            {
                type: 'bar',
                label: '실패',
                backgroundColor: 'rgb(255, 106, 107)',
                data: failureVal,
            },
        ]
    }


    return (
        <div className='w-[80%]'>
            <Line type="line" data={data} />
        </div>
    )
}

export default PredGraph
