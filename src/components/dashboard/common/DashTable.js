import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import TransactionModal from './TransactionModal'

function DashTable({
    stocks,
    title = 'table',
    option,
    addToTable,
    removeFromTable,
}) {
    const [show, setShow] = useState(false)
    const [showRemove, setShowRemove] = useState(false)
    const [showAddToWatchlist, setShowAddIcon] = useState(false)
    const [showPortfolioItems, setShowPortfolioItems] = useState(false)
    const [stockToAdd, setStockToAdd] = useState({})
    useEffect(() => {
        initialiseSettings()
    }, [stockToAdd])
    //MAYBE: Add 3 different modals to show/hide below depending on the button clicked
    function handleAddStockShow(e, index) {
        setStockToAdd(stocks[index])
        setShow(true)
    }

    function initialiseSettings() {
        if (option === 'watchlist') {
            setShowRemove(true)
            setShowAddIcon(false)
        }
        if (option === 'recommended') {
            setShowRemove(false)
            setShowAddIcon(true)
        }
        if (option === 'portfolio') {
            setShowPortfolioItems(true)
        }
    }
    return (
        <>
            <div className="d-flex flex-column dash-card-block">
                <div className="list--title">{title}</div>
                <div className="card forecast-data-table list--value mr-0">
                    <table>
                        <thead>
                            <tr>
                                <td>Symbol</td>
                                <td>Name</td>
                                {showPortfolioItems && (
                                    <>
                                        <td>Avg Price Bought</td>
                                        <td>Quantity</td>
                                        <td>Market Value</td>
                                        <td>Industry</td>
                                        <td>Market Cap ($M)</td>
                                    </>
                                )}

                                <td>Latest Price</td>
                                <td>% Change</td>
                                <td>Volume Transacted</td>
                                {/* <td>Prediction</td> */}
                                <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks &&
                                stocks.map((stock, index) => (
                                    <tr key={stock.symbol}>
                                        <td data-label="Symbol">
                                            <NavLink
                                                to={`/dashboard/details/${stock.symbol}`}
                                            >
                                                {stock.symbol}
                                            </NavLink>
                                        </td>
                                        <td data-label="Name">
                                            {stock.shortName}
                                        </td>
                                        {showPortfolioItems && (
                                            <>
                                                <td data-label="Avg Price Bought">
                                                    $
                                                    {stock.averagePriceBought.toFixed(
                                                        2,
                                                    )}
                                                </td>
                                                <td data-label="Quantity on Hand">
                                                    {stock.totalQuantity}
                                                </td>
                                                <td data-label="Market Value">
                                                    $
                                                    {(
                                                        stock.totalQuantity *
                                                        stock.currentPrice
                                                    ).toFixed(2)}
                                                </td>
                                                <td data-label="Industry">
                                                    {stock.industry}
                                                </td>
                                                <td data-label="Market Cap">
                                                    {(
                                                        stock.marketCap /
                                                        1000000
                                                    ).toFixed(0)}
                                                </td>
                                            </>
                                        )}

                                        <td data-label="Latest Price">
                                            ${stock.regularMarketPrice}
                                        </td>
                                        <td
                                            data-label="% Change"
                                            className={`${
                                                stock.regularMarketChangePercent
                                                    .toString()
                                                    .charAt(0) === '-'
                                                    ? 'red'
                                                    : 'green'
                                            }`}
                                        >
                                            {stock.regularMarketChangePercent.toFixed(
                                                2,
                                            )}
                                            %
                                        </td>
                                        <td data-label="Volume Transacted">
                                            {stock.regularMarketVolume}
                                        </td>
                                        {/* <td data-label="Prediction"
                                    className={`${stock.yhat_30_advice === "BUY" && "green"} 
                                                ${stock.yhat_30_advice == "HOLD" && "orange"}  
                                                ${stock.yhat_30_advice == "SELL" && "red"}`}>
                                    {stock.yhat_30_advice}</td> */}
                                        <td>
                                            <span className="material-icons">
                                                {showRemove && (
                                                    <span
                                                        className="material-icons-outlined"
                                                        onClick={(e) =>
                                                            removeFromTable(
                                                                e,
                                                                stock.symbol,
                                                            )
                                                        }
                                                    >
                                                        close
                                                    </span>
                                                )}

                                                {showAddToWatchlist && (
                                                    <span
                                                        className="material-icons-outlined"
                                                        onClick={() =>
                                                            addToTable(
                                                                stock.symbol,
                                                            )
                                                        }
                                                    >
                                                        playlist_add
                                                    </span>
                                                )}

                                                <span
                                                    className="material-icons-outlined"
                                                    onClick={(e) =>
                                                        handleAddStockShow(
                                                            e,
                                                            index,
                                                        )
                                                    }
                                                >
                                                    add
                                                </span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
                <TransactionModal
                    setShow={setShow}
                    show={show}
                    context={stockToAdd}
                    defaultValue={{
                        region: 'SG',
                        quantity: 0,
                        currency: 'SGD',
                        exchangeRateToSGD: 1,
                        action: 'BOUGHT',
                        type: 'EQUITY',
                        account: 'EQUITY',
                        finalAmount: 0,
                    }}
                />
        </>
    )
}

export default DashTable
