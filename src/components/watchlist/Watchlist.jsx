import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { formatNumber } from '../../lib/utils'
import { portfolioService } from '../../services/portfolio'
import Table from '../common/Table'
import StockModal from '../portfolio/components/StockModal'

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

function Watchlist({ watchlistInfo, commonInfo, getWatchlist, getPortfolio }) {
    const [addShow, setAddShow] = useState(false)
    const [modalStock, setModalStock] = useState()
    let [watchlist, setWatchlist] = useState()
    let [textInput, setTextInput] = useState('')
    let [autosuggest, setAutoSuggest] = useState([])
    let [showSearchResults, setShowSearchResults] = useState(false)

    const initialiseSettings = useCallback(() => {
        let _watchlist = watchlistInfo.map((stock) => {
            return {
                ...watchlistInfo[stock.symbol],
                ...commonInfo[stock.symbol],
            }
        })
        setWatchlist(_watchlist)
    }, [watchlistInfo, commonInfo])

    useEffect(() => {
        initialiseSettings()
    }, [initialiseSettings])

    const debouncedGetAutoComplete = useCallback(
        debounce(async (searchTerm) => {
            await getAutoComplete(searchTerm)
        }, 3000),
        [],
    )

    function handleInput(e) {
        setTextInput(e.target.value)
        setShowSearchResults(true)
        debouncedGetAutoComplete(e.target.value)
    }

    function handleAddStockShow(e, stock) {
        setModalStock(stock)
        setAddShow(true)
    }

    async function getAutoComplete(searchTerm, region = 'SG') {
        let suggestions = await portfolioService.getAutoComplete(
            searchTerm,
            region,
        )
        setAutoSuggest(suggestions)
    }

    const addToWatchlist = useCallback(
        async (e, symbol) => {
            e.preventDefault()
            setShowSearchResults(false)
            await portfolioService.addToWatchlist(symbol)
            await getWatchlist()
        },
        [getWatchlist],
    )

    const removeFromWatchList = useCallback(
        async (e, symbol) => {
            e.preventDefault()
            await portfolioService.removeFromWatchlist(symbol)
            await getWatchlist()
        },
        [getWatchlist],
    )

    function watchlistHeaders() {
        return (
            <>
                <td>Symbol</td>
                <td>Name</td>
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

    function watchlistRows() {
        return (
            <>
                {watchlistInfo &&
                    watchlist &&
                    watchlist.map((stock, index) => (
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
                                ${stock.regularMarketPrice}
                            </td>
                            <td
                                data-label="% Change"
                                className={getStatusColor(
                                    stock.regularMarketChangePercent,
                                )}
                            >
                                {formatNumber(stock.regularMarketChangePercent)}
                                %
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
                                            removeFromWatchList(e, stock.symbol)
                                        }
                                    >
                                        remove
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
            <h1>Watch List</h1>
            <Row className="mb-4 no-gutters">
                <Col className="col-12">
                    <Form inline>
                        <div className="search-bar search-bar-dash material-icons">
                            <input
                                type="text"
                                placeholder="Search Stocks"
                                onChange={handleInput}
                            />
                            {showSearchResults && (
                                <div className="auto-suggest">
                                    <ul>
                                        {autosuggest?.length > 0 ? (
                                            autosuggest.map((stock) => (
                                                <li
                                                    key={stock.symbol}
                                                    style={styles.searchResults}
                                                >
                                                    <NavLink
                                                        to={`/dashboard/details/${stock.symbol}`}
                                                    >
                                                        {`[${stock.symbol}] ${stock.shortname}`}
                                                    </NavLink>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={(e) =>
                                                            addToWatchlist(
                                                                e,
                                                                stock.symbol,
                                                            )
                                                        }
                                                    >
                                                        Add
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No Stocks Found</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row className="no-gutters">
                <Col className={`col-12 col-xl-6`}>
                    <Table
                        rows={watchlistRows()}
                        headers={watchlistHeaders()}
                    />
                </Col>
            </Row>
            {modalStock && addShow && (
                <StockModal
                    setShow={setAddShow}
                    show={addShow}
                    context={modalStock}
                    defaultValue={DEFAULT_ADD}
                    getFunction={getPortfolio}
                />
            )}
        </>
    )
}

const styles = {
    searchResults: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
}

export default Watchlist
