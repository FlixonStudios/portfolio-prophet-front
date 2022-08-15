import React, { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Table from './common/Table'
import { Col, Row } from 'react-bootstrap'
import DashCard from './common/DashCard'
import TransactionModal from './common/TransactionModal'

const DEFAULT_ADD = {
    region: 'SG',
    quantity: 0,
    currency: 'SGD',
    exchangeRateToSGD: 1,
    action: 'BOUGHT',
    type: 'EQUITY',
    account: 'EQUITY',
    finalAmount: 0,
    dateAdded: new Date(),
}

const DEFAULT_SELL = {
    region: 'SG',
    quantity: 0,
    currency: 'SGD',
    exchangeRateToSGD: 1,
    action: 'SOLD',
    type: 'EQUITY',
    account: 'EQUITY',
    finalAmount: 0,
    dateAdded: new Date(),
}

function Portfolio({
    portfolioInfo, // object with portfolio info (key: symbol)
    commonInfo, // object with quote info (key: symbol)
}) {
    const [addShow, setAddShow] = useState(false)
    const [sellShow, setSellShow] = useState(false)
    const [portfolio, setPortfolio] = useState([])
    const [modalStock, setModalStock] = useState()

    const initialiseSettings = useCallback(() => {
        let _portfolio = Object.keys(portfolioInfo).map((symbol) => {
            return {
                ...portfolioInfo[symbol],
                ...commonInfo[symbol],
            }
        })
        setPortfolio(_portfolio)
    }, [portfolioInfo, commonInfo])

    useEffect(() => {
        initialiseSettings()
    }, [portfolioInfo, commonInfo, initialiseSettings])

    function handleAddStockShow(e, stock) {
        setModalStock(stock)
        setSellShow(false)
        setAddShow(true)
    }

    function handleSellStockShow(e, stock) {
        setModalStock(stock)
        setAddShow(false)
        setSellShow(true)
    }

    function portfolioHeaders() {
        return (
            <>
                <td>Symbol</td>
                <td>Name</td>
                <td>Avg Price Bought</td>
                <td>Quantity</td>
                <td>Market Value</td>
                <td>Market Cap ($M)</td>
                <td>Latest Price</td>
                <td>% Change</td>
                <td>Volume Transacted</td>
                <td>Actions</td>
            </>
        )
    }

    function getStatusColor(percentage) {
        if (percentage) {
            return percentage.toString().charAt(0) === '-' ? 'red' : 'green'
        }
        return ''
    }

    function portfolioRows() {
        return (
            <>
                {Object.keys(portfolioInfo).length > 0 &&
                    portfolio &&
                    portfolio.map((stock, index) => (
                        <tr>
                            <td>
                                <NavLink
                                    to={`/dashboard/details/${stock.symbol}`}
                                >
                                    {stock.symbol}
                                </NavLink>
                            </td>
                            <td data-label="Name">{stock.shortName}</td>
                            <td data-label="Avg Price Bought">
                                ${stock.total / stock.quantity}
                            </td>
                            <td data-label="Quantity on Hand">
                                {stock.quantity}
                            </td>
                            <td data-label="Market Value">
                                ${stock.quantity * stock.regularMarketPrice}
                            </td>
                            <td data-label="Market Cap">
                                {stock.marketCap / 1000000}
                            </td>
                            <td data-label="Latest Price">
                                ${stock.regularMarketPrice}
                            </td>
                            <td
                                data-label="% Change"
                                className={getStatusColor(
                                    stock.regularMarketChangePercent,
                                )}
                            >
                                {stock.regularMarketChangePercent.toFixed(2)}%
                            </td>
                            <td data-label="Volume Transacted">
                                {stock.regularMarketVolume}
                            </td>
                            <td>
                                <span className="material-icons">
                                    <span
                                        className="material-icons-outlined"
                                        onClick={(e) =>
                                            handleAddStockShow(e, stock)
                                        }
                                    >
                                        add
                                    </span>
                                    <span
                                        className="material-icons-outlined"
                                        onClick={(e) =>
                                            handleSellStockShow(e, stock)
                                        }
                                    >
                                        attach_money
                                    </span>
                                </span>
                            </td>
                        </tr>
                    ))}
            </>
        )
    }

    return (
        <>
            <h1>Portfolio</h1>
            <Row className="mb-4 no-gutters">
                <Col className="col-12 col-md-3">
                    <DashCard title={'Current Value'} />
                </Col>
                <Col className="col-12 col-md-3">
                    <DashCard title={'% Change'} />
                </Col>
            </Row>
            <Row className="mb-4 no-gutters">
                <Col className="col-12">
                    <DashCard title={'Portfolio Growth over Time'} />
                </Col>
            </Row>
            <Table
                title="Portfolio"
                headers={portfolioHeaders()}
                rows={portfolioRows()}
            />

            {modalStock && (
                <>
                    {addShow && (
                        <TransactionModal
                            setShow={setAddShow}
                            show={addShow}
                            context={modalStock}
                            defaultValue={DEFAULT_ADD}
                        />
                    )}

                    {sellShow && (
                        <TransactionModal
                            setShow={setSellShow}
                            show={sellShow}
                            context={modalStock}
                            defaultValue={DEFAULT_SELL}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default Portfolio
