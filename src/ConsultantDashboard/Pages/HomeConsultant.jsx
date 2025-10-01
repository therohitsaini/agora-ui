import React, { Fragment } from 'react'
import Overview from '../../Utils/Overview'
import { cardData } from '../../FalbackData'
import SessionsChart from '../../Charts/SessionsChart'
import { PageViewsBarChart } from '../../Charts/SparklineChart'
import DataGridTable from '../../components/DataGridTable'

function HomeConsultant() {
   return (
      <Fragment>
         <Overview cardData={cardData} />
         <div className='flex gap-5 mt-5 my-5'>
            <SessionsChart />
            <PageViewsBarChart />
         </div>
         <DataGridTable />
         <div className='w-full text-slate-600 py-10 text-center'>    © 2025 Saini Web Solutions. All rights reserved.</div>
      </Fragment>
   )
}

export default HomeConsultant