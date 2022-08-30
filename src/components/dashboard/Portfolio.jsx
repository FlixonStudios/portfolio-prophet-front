import React, { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Table from './common/Table'
import { Button, Col, Row } from 'react-bootstrap'
import DashCard from './common/DashCard'
import StockModal from './common/StockModal'
import CashModal from './common/CashModal'
import DividendModal from './common/DividendModal'
import { formatNumber } from '../../lib/utils'

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

const DEFAULT_DIVIDEND = {
    region: 'SG',
    action: 'DEPOSIT',
    type: 'DIVIDEND',
    account: 'CASH',
    dateAdded: new Date(),
}

function Portfolio({
    portfolioEquity,
    portfolioCash,
    commonInfo,
    getPortfolio,
}) {
    const [addShow, setAddShow] = useState(false)
    const [sellShow, setSellShow] = useState(false)
    const [dividendShow, setDividendShow] = useState(false)
    const [showCashModal, setShowCashModal] = useState(false)
    const [portfolio, setPortfolio] = useState([])
    const [modalStock, setModalStock] = useState()
    const [cashAction, setCashAction] = useState()

    const initialiseSettings = useCallback(() => {
        let _portfolio = Object.keys(portfolioEquity).map((symbol) => {
            return {
                ...portfolioEquity[symbol],
                ...commonInfo[symbol],
            }
        })
        setPortfolio(_portfolio)
    }, [portfolioEquity, commonInfo])

    useEffect(() => {
        initialiseSettings()
    }, [portfolioEquity, commonInfo, initialiseSettings])

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

    function handleShowCashModal(e, action) {
        setCashAction(action)
        setShowCashModal(true)
    }

    function handleDividendShow(e, stock) {
        setModalStock(stock)
        setDividendShow(true)
    }

    function getCashValue() {
        let cashValue = 0
        if (portfolioCash) {
            const capital = portfolioCash['CAPITAL']
                ? portfolioCash['CAPITAL'].total
                : 0
            const dividend = portfolioCash['DIVIDEND']
                ? portfolioCash['DIVIDEND'].total
                : 0
            cashValue = capital + dividend
        }
        return cashValue
    }

    function getEquityValue() {
        let marketValue = 0
        if (portfolioCash && portfolioEquity) {
            marketValue = portfolio.reduce(
                (total, stock) =>
                    (total += stock.quantity * stock.regularMarketPrice),
                0,
            )
        }
        return marketValue
    }

    function getPortfolioValue() {
        return getEquityValue() + getCashValue()
    }

    function getOverallPercentageChange() {
        const capitalInvestment = portfolioCash['CAPITAL'].records.reduce(
            (total, record) => {
                if (record.symbol === '_CASH') {
                    return (total += record.finalAmount)
                }
                return total
            },
            0,
        )

        const percentage = getPortfolioValue() / capitalInvestment
        const percentageChange = percentage * 100 - 100

        return percentageChange
    }

    function portfolioHeaders() {
        return (
            <>
                <td>Symbol</td>
                <td>Name</td>
                <td>Avg Price Bought</td>
                <td>Quantity</td>
                <td>Market Value</td>
                <td>Unrealised P/L</td>
                <td>Latest Price</td>
                <td>% Change</td>
                <td>% of Portfolio</td>
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
                {Object.keys(portfolioEquity).length > 0 &&
                    portfolio &&
                    portfolio.map((stock, index) => {
                        if (stock.quantity > 0) {
                            const marketValue =
                                stock.quantity * stock.regularMarketPrice
                            const equityValue = getEquityValue()
                            const unrealisedPNL =
                                marketValue -
                                stock.quantity * stock.averagePriceBought
                            const marketCap = stock.marketCap / 1000000
                            return (
                                <tr key={index}>
                                    <td>
                                        <NavLink
                                            to={`/dashboard/details/${stock.symbol}`}
                                        >
                                            {stock.symbol}
                                        </NavLink>
                                    </td>
                                    <td data-label="Name">{stock.shortName}</td>
                                    <td data-label="Avg Price Bought">
                                        $
                                        {formatNumber(stock.averagePriceBought)}
                                    </td>
                                    <td data-label="Quantity on Hand">
                                        {stock.quantity}
                                    </td>
                                    <td data-label="Market Value">
                                        ${formatNumber(marketValue)}
                                    </td>
                                    <td
                                        data-label="Unrealised P/L"
                                        className={getStatusColor(
                                            unrealisedPNL,
                                        )}
                                    >
                                        {formatNumber(unrealisedPNL)}
                                    </td>
                                    <td data-label="Latest Price">
                                        $
                                        {formatNumber(stock.regularMarketPrice)}
                                    </td>
                                    <td
                                        data-label="% Change"
                                        className={getStatusColor(
                                            stock.regularMarketChangePercent,
                                        )}
                                    >
                                        {formatNumber(
                                            stock.regularMarketChangePercent,
                                        )}
                                        %
                                    </td>
                                    <td data-label="% of Portfolio">
                                        {`${formatNumber(
                                            (marketValue / equityValue) * 100,
                                        )}%`}
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
                                                    handleSellStockShow(
                                                        e,
                                                        stock,
                                                    )
                                                }
                                            >
                                                attach_money
                                            </span>
                                            <span
                                                className="material-icons-outlined"
                                                onClick={(e) =>
                                                    handleDividendShow(e, stock)
                                                }
                                            >
                                                paid
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            )
                        }
                        return null
                    })}
            </>
        )
    }

    return (
        <>
            <h1>Portfolio</h1>
            <Row className="mb-4 no-gutters">
                <Col className="col-12 col-md-3">
                    <DashCard
                        title={'Current Value'}
                        value={`$ ${formatNumber(getPortfolioValue())}`}
                    />
                </Col>
                <Col className="col-12 col-md-3">
                    <DashCard
                        title={'% Change'}
                        value={`${formatNumber(
                            getOverallPercentageChange(),
                        )} %`}
                    />
                </Col>
                <Col className="col-12 col-md-3">
                    <DashCard
                        title={'Cash'}
                        value={`$ ${formatNumber(getCashValue())}`}
                    />
                </Col>
                <Col
                    className="col-12 col-md-3 d-flex flex-column align-items-center"
                    style={{}}
                >
                    <Button
                        variant="primary"
                        onClick={(e) => handleShowCashModal(e, 'DEPOSIT')}
                    >
                        Deposit
                    </Button>
                    <Button
                        variant="success"
                        onClick={(e) => handleShowCashModal(e, 'WITHDRAW')}
                    >
                        Withdraw
                    </Button>
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
                        <StockModal
                            setShow={setAddShow}
                            show={addShow}
                            context={modalStock}
                            defaultValue={DEFAULT_ADD}
                            getFunction={getPortfolio}
                        />
                    )}

                    {sellShow && (
                        <StockModal
                            setShow={setSellShow}
                            show={sellShow}
                            context={modalStock}
                            defaultValue={DEFAULT_SELL}
                            getFunction={getPortfolio}
                        />
                    )}

                    {dividendShow && (
                        <DividendModal
                            setShow={setDividendShow}
                            show={dividendShow}
                            context={modalStock}
                            defaultValue={DEFAULT_DIVIDEND}
                            getFunction={getPortfolio}
                        />
                    )}
                </>
            )}

            {showCashModal && (
                <CashModal
                    setShow={setShowCashModal}
                    show={showCashModal}
                    action={cashAction}
                    getFunction={getPortfolio}
                />
            )}
        </>
    )
}

export default Portfolio
