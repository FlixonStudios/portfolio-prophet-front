import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import { portfolioService } from '../../services/portfolio'
import { Transactions } from '../transactions/Transactions'
import Details from '../website/Details'
import SideNavigation from '../navigation/SideNavigation'
import DashboardContent from './DashboardContent'
import Portfolio from '../portfolio/Portfolio'
import Settings from '../settings/Settings'
import Watchlist from '../watchlist/Watchlist'

function Dashboard({ setAuth, auth }) {
    let [userStocks, setUserStocks] = useState()
    let [watchlist, setWatchList] = useState([])
    let [portfolio, setPortfolio] = useState()
    let [transactions, setTransactions] = useState()

    const getUserStocks = useCallback(async () => {
        const data = await portfolioService.getUserStocks()
        setUserStocks(data)
    }, [])

    const getWatchlist = useCallback(async () => {
        let { data } = await portfolioService.getWatchlist()
        setWatchList(data)
    }, [])

    const getPortfolio = useCallback(async () => {
        let { data } = await portfolioService.getPortfolio()
        setPortfolio(data)
    }, [])

    const getTransactions = useCallback(async () => {
        let { data } = await portfolioService.getTransactions()
        setTransactions(data)
    }, [])

    useEffect(() => {
        getWatchlist()
        getPortfolio()
        getTransactions()
    }, [auth, getWatchlist, getPortfolio, getTransactions])

    useEffect(() => {
        //TODO: Find a way to stop get userStocks from being called 3 times on startup
        getUserStocks()
    }, [getUserStocks, watchlist, portfolio])

    return (
        <div className="dashboard-container">
            <SideNavigation setAuth={setAuth} />
            <Container fluid className="px-0 dashboard-content">
                <Route path="/dashboard" exact>
                    {userStocks && portfolio && (
                        <DashboardContent
                            commonInfo={userStocks}
                            portfolioEquity={portfolio['EQUITY']}
                            portfolioCash={portfolio['CASH']}
                            getPortfolio={getPortfolio}
                            dashboardInfo={watchlist}
                        />
                    )}
                </Route>
                <Route path="/dashboard/portfolio" exact>
                    {userStocks && portfolio && (
                        <Portfolio
                            commonInfo={userStocks}
                            portfolioEquity={portfolio['EQUITY']}
                            portfolioCash={portfolio['CASH']}
                            getPortfolio={getPortfolio}
                        />
                    )}
                </Route>
                <Route path="/dashboard/watchlist">
                    {userStocks && watchlist && (
                        <Watchlist
                            watchlistInfo={watchlist}
                            commonInfo={userStocks}
                            getWatchlist={getWatchlist}
                            getPortfolio={getPortfolio}
                        />
                    )}
                </Route>
                <Route path="/dashboard/transactions">
                    {userStocks && transactions && (
                        <Transactions
                            transactions={transactions}
                            getTransactions={getTransactions}
                        />
                    )}
                </Route>
                <Route path="/dashboard/details/:symbol">
                    <Details auth={auth} watchlist={watchlist} />
                </Route>
                <Route path="/dashboard/settings">
                    <Settings />
                </Route>
            </Container>
        </div>
    )
}

export default Dashboard
