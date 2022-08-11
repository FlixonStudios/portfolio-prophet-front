import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { portfolioService } from '../../services/portfolio'
import DashTable from './common/DashTable'

function Watchlist({ allStocks, watchlist }) {
    let [topFive, setTopFive] = useState([])

    let fiveStocks = []
    useEffect(() => {
        if (allStocks) {
            fiveStocks = [...allStocks]
                .sort((a, b) => {
                    return b.yhat_30_ratio - a.yhat_30_ratio
                })
                .slice(0, 5)
            setTopFive(fiveStocks)
        }
    }, [allStocks])

    let [textInput, setTextInput] = useState('')
    let [autosuggest, setAutoSuggest] = useState([])
    let [showSearchResults, setShowSearchResults] = useState(false)

    const debouncedGetAutoComplete = useCallback(
        debounce(async (searchTerm) => {
            // TODO: Fix one letter delay
            await getAutoComplete(searchTerm)
        }, 3000),
        [],
    )

    function handleInput(e) {
        setTextInput(e.target.value)
        setShowSearchResults(true)
        debouncedGetAutoComplete(e.target.value)
    }

    async function getAutoComplete(searchTerm, region = 'SG') {
        let suggestions = await portfolioService.getAutoComplete(
            searchTerm,
            region,
        )
        setAutoSuggest(suggestions)
    }

    async function addToWatchlist(e, symbol) {
        e.preventDefault()
        setShowSearchResults(false)
        await portfolioService.addToWatchlist(symbol)
    }

    async function removeFromWatchList(e, symbol) {
        e.preventDefault()
        await portfolioService.removeFromWatchlist(symbol)
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
                    <DashTable
                        title={'Watchlist'}
                        option="watchlist"
                        stocks={watchlist}
                        removeFromTable={removeFromWatchList}
                    />
                </Col>
                <Col className={`col-12 col-xl-6`}>
                    <DashTable
                        title={'Recommended Stocks'}
                        option="recommended"
                        stocks={topFive}
                        addToTable={addToWatchlist}
                    />
                </Col>
            </Row>
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
