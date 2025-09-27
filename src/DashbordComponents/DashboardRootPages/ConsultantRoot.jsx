import React, { useState } from 'react'
import { Fragment } from 'react'
import AddConsultantForm from '../DashbordPages/AddConsultantForm'
import ConsultantTable from '../DashbordPages/ConsultantTable'
import { Button } from '@mui/material'

function ConsultantRoot() {
    const [isTrue, setIsTrue] = useState(false)

    const isHandler = async () => {
        setIsTrue(!isTrue)
    }

    return (
        <Fragment>
            <div className='w-full flex justify-end px-20 '>
                <Button
                    sx={{
                        backgroundColor: "#ecf2f3",
                        color: "black",
                        textTransform: "none"
                    }}
                    onClick={isHandler}
                    variant='contained'>
                    {
                        isTrue ? "Go Consultor Table" : "Go Consultor Registration"
                    }

                </Button>

            </div>
            {
                isTrue ? <AddConsultantForm /> : <ConsultantTable />
            }
        </Fragment>
    )
}

export default ConsultantRoot