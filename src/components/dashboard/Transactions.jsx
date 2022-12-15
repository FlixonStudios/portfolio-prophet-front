import React from 'react'
import { Col } from 'react-bootstrap'
import Table from './common/Table'

export function Transactions({ transactions }) {
    function transactionHeaders() {
        return (
            <>
                <td>Id</td>
                <td>User Id</td>
                <td>Symbol</td>
                <td>Date Added</td>
                <td>Currency</td>
                <td>Unit Price</td>
                <td>Action</td>
                <td>Type</td>
                <td>Fee</td>
                <td>Account</td>
                <td>Final Amount</td>
            </>
        )
    }
    function transactionRows() {
        return (
            <>
                {transactions &&
                    transactions.map((transaction, index) => {
                        const {
                            id,
                            userId,
                            symbol,
                            dateAdded,
                            currency,
                            unitPrice,
                            action,
                            type,
                            fee,
                            account,
                            finalAmount,
                        } = transaction
                        return (
                            <tr key={index}>
                                <td>{id}</td>
                                <td>{userId}</td>
                                <td>{symbol}</td>
                                <td>{dateAdded}</td>
                                <td>{currency}</td>
                                <td>{unitPrice}</td>
                                <td>{action}</td>
                                <td>{type}</td>
                                <td>{fee}</td>
                                <td>{account}</td>
                                <td>{finalAmount}</td>
                            </tr>
                        )
                    })}
            </>
        )
    }
    return (
        <>
            <h1>Transactions</h1>
            <Col className={`col-12 col-xl-6`}>
                <Table
                    headers={transactionHeaders()}
                    rows={transactionRows()}
                    title=""
                />
            </Col>
        </>
    )
}
