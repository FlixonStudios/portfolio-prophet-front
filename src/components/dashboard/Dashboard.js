import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import Axios from '../../lib/Axios'
import { portfolioService } from '../../services/portfolio'
import Details from '../website/Details'
import DashContent from './common/DashContent'
import Portfolio from './Portfolio'
import SideNavigation from './common/SideNavigation'
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

    useEffect(() => {
        getWatchlist()
        getPortfolio()
    }, [auth])

    useEffect(() => {
        getUserStocks()
    }, [getUserStocks, portfolio, watchlist])

    async function getWatchlist() {
        let { data } = await portfolioService.getWatchlist();

        setWatchList(data)
    }

    async function getPortfolio() {
        let { data } = await portfolioService.getPortfolio()
    async function removeFromWatchList(stock_id) {
        let { data } = await Axios.post(`/api/watchlist_delete/`, {
            id: stock_id,
        })
        getWatchlist()
        setPortfolio(data['EQUITY'])
    }

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
                            portfolioInfo={portfolio}
                        />
                    )}
                </Route>
                <Route path="/dashboard/watchlist">
                    <Watchlist watchlistInfo={watchlist} commonInfo={userStocks} />
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
