import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { formatNumber, getStatusColor } from '../../lib/utils'
import CustomPie from './common/CustomPie'
import Table from './common/Table'
import styled from 'styled-components'
import { Col, Row } from 'react-bootstrap'
import DashCard from './common/DashCard'

function DashboardContent({
    commonInfo,
    dashboardInfo,
    portfolioEquity,
    portfolioCash,
    getPortfolio,
}) {
    const [dashboard, setDashboard] = useState([])
    const [portfolio, setPortfolio] = useState([])
    useEffect(() => {
        let _dashboard = dashboardInfo.map((stock) => {
            return {
                ...dashboardInfo[stock.symbol],
                ...commonInfo[stock.symbol],
            }
        })
        setDashboard(_dashboard)
    }, [dashboardInfo, commonInfo])

    useEffect(() => {
        let _portfolio = Object.keys(portfolioEquity).map((symbol) => {
            return {
                ...portfolioEquity[symbol],
                ...commonInfo[symbol],
            }
        })
        setPortfolio(_portfolio)
    }, [portfolioEquity, commonInfo])

    function dashboardHeaders() {
        return (
            <>
                <td>Symbol</td>
                <td>Name</td>
                <td>Latest Price</td>
                <td>Beta</td>
                <td>% of Portfolio</td>
                <td>Price:Book Ratio</td>
                <td>Dividend Yield</td>
                <td>% Change</td>
            </>
        )
    }

    function dashboardRows() {
        return (
            <>
                {Object.keys(portfolioEquity).length > 0 &&
                    portfolio &&
                    portfolio.map((stock, index) => {
                        if (stock.quantity > 0) {
                            const marketValue =
                                stock.quantity * stock.regularMarketPrice
                            const equityValue = getEquityValue()
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
                                    <td data-label="Latest Price">
                                        $
                                        {formatNumber(stock.regularMarketPrice)}
                                    </td>
                                    <td data-label="Beta">
                                        {formatNumber(stock.beta)}
                                    </td>
                                    <td data-label="% of Portfolio">
                                        {`${formatNumber(
                                            (marketValue / equityValue) * 100,
                                        )}%`}
                                    </td>
                                    <td data-label="PriceToBookRatio">
                                        {formatNumber(stock.priceToBook)}
                                    </td>
                                    <td data-label="Dividend Yield">
                                        {`${formatNumber(
                                            stock.dividendYield,
                                        )}%`}
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
                                </tr>
                            )
                        }
                        return null
                    })}
            </>
        )
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

    function getEquityPercentage() {
        const equityValue = getEquityValue()
        const equityPercentage = portfolio.map((stock) => {
            const marketValue = stock.quantity * stock.regularMarketPrice
            return {
                symbol: stock.symbol,
                percent: (marketValue / equityValue) * 100,
            }
        })
        return equityPercentage
    }

    function getPortfolioPercentage() {
        const cashValue = portfolioCash['CAPITAL'].quantity
        const equityValue = getEquityValue()
        const cashPercentage = (cashValue / (cashValue + equityValue)) * 100
        const cashObj = {
            symbol: portfolioCash['CAPITAL'].symbol,
            percent: cashPercentage,
        }
        const equityPercentage = equityValue / (cashValue + equityValue)
        const equityBreakdown = getEquityPercentage().map((stock) => ({
            ...stock,
            percent: stock.percent * equityPercentage,
        }))

        const portfolioPercentage = [...equityBreakdown, cashObj]
        return portfolioPercentage
    }

    function getPortfolioBeta() {
        const equityValue = getEquityValue()
        const totalBeta = portfolio.reduce((prev, stock) => {
            return (
                prev +
                (stock.beta * stock.quantity * stock.regularMarketPrice) /
                    equityValue
            )
        }, 0)
        return totalBeta
    }

    return (
        <>
            <h1>Dashboard</h1>
            <Row className="mb-4 no-gutters">
                <Col className="col-12 col-md-3">
                    <DashCard
                        title={'Overall Beta'}
                        value={`${formatNumber(getPortfolioBeta())}`}
                    />
                </Col>
            </Row>
            <PieContainer>
                <CustomPie
                    data={getEquityPercentage()}
                    dataKey="percent"
                    nameKey="symbol"
                />
                <CustomPie
                    data={getPortfolioPercentage()}
                    dataKey="percent"
                    nameKey="symbol"
                />
            </PieContainer>
            <Table
                title="Portfolio Analysis"
                headers={dashboardHeaders()}
                rows={dashboardRows()}
            />
        </>
    )
}

const PieContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
`

export default DashboardContent
