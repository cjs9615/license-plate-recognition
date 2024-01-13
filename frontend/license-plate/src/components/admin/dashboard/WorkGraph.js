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

const WorkGraph = ({values}) => {
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
        labels: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
        datasets: [
            {
                type: 'bar',
                label: '작업량',
                backgroundColor: 'rgb(75, 192, 192)',
                data: values,
            },
        ]
    }


    return (
        <div className='w-[80%]'>
            <Line type="line" data={data} />
        </div>
    )
}

export default WorkGraph
