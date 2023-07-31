import React from 'react'
import { Line } from 'react-chartjs-2' 

export default function Summer() {

    const data ={
        labels:['Jan','Feb','March','April'],
        datasets: [{
            label: 'sales',
            data: [100,200,150,300],
            borderColor: 'rgb(75,192,192)',
            fill:false,
        },],
    }

    const options = {
        scales:{
            y:{
                type: 'linear',
                beginAtZero: true,
            },
        },
    }

  return (
    <div>
<div className="flex flex-row">

<div className='bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-3/5  m-2'>
<div className="px-6 py-2 border-b border-light-grey">
                                <div className="font-bold text-xl">Sold items</div>
                            </div>
                            <div className="table-responsive">
<table className="table text-grey-darkest">
                                    <thead className="bg-grey-dark text-white text-normal">
                                    <tr>
                                        
                                        <th scope="col">Product</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>
                                            <button className="bg-blue-500 hover:bg-blue-800 text-white font-light py-1 px-2 rounded-full">
                                                Twitter
                                            </button>
                                        </td>
                                        <td>4500</td>
                                       
                                        <td>
                                            <span className="text-green-500"><i className="fas fa-arrow-up"></i>5%</span>
                                        </td>
                                    </tr>
                                   

                                    </tbody>
                                </table>
</div>
</div>


<div className='bg-white text-black mx-auto rounded overflow-hidden shadow-lg  w-2/4'>
<div className="font-bold text-xl">Week sales</div>
<Line data ={data} options={options}/>


</div>




</div>


    </div>
  )
}
