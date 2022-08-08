import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import Axios from '../../lib/Axios'
import { portfolioService } from '../../services/portfolio'
import Details from '../website/Details'
import DashContent from './common/DashContent'
import SideNavigation from './common/SideNavigation'
import Portfolio from './Portfolio'
import Settings from './Settings'
import Watchlist from './Watchlist'

function Dashboard({ setAuth, auth }) {
    let [allStocks, setAllStocks] = useState([])

    useEffect(() => {
        async function getStocks() {
            let { data } = await Axios.get('/api/show_all/')
            setAllStocks(data['stock_record_all'])
        }
        getStocks()
    }, [])

    let [watchlist, setWatchList] = useState([])

    async function getWatchlist() {
        let { data } = await portfolioService.getWatchlist();
        setWatchList(data)
    }

    async function removeFromWatchList(stock_id) {
        let { data } = await Axios.post(`/api/watchlist_delete/`, {
            id: stock_id,
        })
        getWatchlist()
    }

    useEffect(() => {
        getWatchlist()
    }, [auth])

    return (
        <div className="dashboard-container">
            <SideNavigation setAuth={setAuth} />
            <Container fluid className="px-0 dashboard-content">
                <Route path="/dashboard" exact>
                    <DashContent
                        watchlist={watchlist}
                        removeFromWatchList={removeFromWatchList}
                    />
                </Route>
                <Route path="/dashboard/portfolio" exact>
                    <Portfolio />
                </Route>
                <Route path="/dashboard/watchlist">
                    <Watchlist
                        watchlist={watchlist}
                        removeFromWatchList={removeFromWatchList}
                        allStocks={allStocks}
                    />
                </Route>
                <Route path="/dashboard/details/:symbol">
                    <Details
                        auth={auth}
                        watchlist={watchlist}
                        removeFromWatchList={removeFromWatchList}
                    />
                </Route>
                <Route path="/dashboard/settings">
                    <Settings />
                </Route>
            </Container>
        </div>
    )
}

export default Dashboard
