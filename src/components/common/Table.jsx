import React from 'react'
import styled from 'styled-components'

const StyledTable = styled.div`
    display: flex,
    flexDirection: column,
`

function Table({ headers, rows, title = 'table' }) {
    return (
        <>
            <StyledTable>
                <div className="list--title">{title}</div>
                <div className="card forecast-data-table list--value mr-0">
                    <table>
                        <thead>
                            <tr>{headers}</tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            </StyledTable>
        </>
    )
}

export default Table
