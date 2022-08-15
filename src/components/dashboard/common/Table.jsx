import React from 'react'

function Table({ headers, rows, title = 'table' }) {
    return (
        <>
            <div className="d-flex flex-column dash-card-block">
                <div className="list--title">{title}</div>
                <div className="card forecast-data-table list--value mr-0">
                    <table>
                        <thead>
                            <tr>
                                {headers} 
                            </tr>
                        </thead>
                        <tbody>
                                {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Table
