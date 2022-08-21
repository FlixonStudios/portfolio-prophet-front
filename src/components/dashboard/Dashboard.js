import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import { portfolioService } from '../../services/portfolio'
import Details from '../website/Details'
import DashContent from './common/DashContent'
import SideNavigation from './common/SideNavigation'
import Portfolio from './Portfolio'
import Settings from './Settings'
import Watchlist from './Watchlist'

function Dashboard({ setAuth, auth }) {
    let [userStocks, setUserStocks] = useState()
    let [watchlist, setWatchList] = useState([])
    let [portfolio, setPortfolio] = useState()

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

    useEffect(() => {
        getWatchlist()
        getPortfolio()
    }, [auth, getWatchlist, getPortfolio])

    useEffect(() => {
        //TODO: Find a way to stop get userStocks from being called 3 times on startup
        getUserStocks()
    }, [getUserStocks, watchlist, portfolio])


    return (
        <div className="dashboard-container">
            <SideNavigation setAuth={setAuth} />
            <Container fluid className="px-0 dashboard-content">
                <Route path="/dashboard" exact>
                    <DashContent watchlist={watchlist} />
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
