import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {Button, Form, Modal} from "react-bootstrap";
import Axios from "../../../lib/Axios"
import AddStockModal from "./AddStockModal";

function DashTable({stocks,title = "table", option, addToTable, removeFromTable}) {
    const [show, setShow] = useState(false);
    const [showRemove, setShowRemove] = useState(false);
    const [showAddToWatchlist, setShowAddToWatchlist] = useState(false);
    const [showPortfolioItems, setShowPortfolioItems] = useState(false)
    const [stockToAdd, setStockToAdd] = useState({})

    useEffect(()=>{
        initialiseSettings()
    },[stockToAdd])

    function handleShow(e){
        let stockObj = {
            "id": e.target.getAttribute("id"),
            "name": e.target.getAttribute("name"),
            "symbol": e.target.getAttribute("symbol"),
            "price": e.target.getAttribute("price"),
        }
        setStockToAdd(stockObj)
        setShow(true);
    }

    function initialiseSettings(){
        if (option === 'watchlist'){
            setShowRemove(true)
        }
        if (option === 'recommended'){
            setShowRemove(false)
            setShowAddToWatchlist(true)
        }
        if (option === 'portfolio'){
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
                            <td>Name</td>
                            {showPortfolioItems &&
                                <>
                                    <td>Avg Price Bought</td>
                                    <td>Quantity</td>
                                    <td>Market Value</td>
                                    <td>Industry</td>
                                    <td>Market Cap ($M)</td>
                                </>
                            }


                            <td>Latest Price</td>
                            <td>% Change</td>
                            <td>Volume Transacted</td>
                            <td>Prediction</td>
                            <td>Actions</td>
                        </tr>
                        </thead>
                        <tbody>
                        {stocks && stocks.map((stock)=>(
                            <tr key={stock.id}>
                                <td data-label="Name">
                                    <NavLink to={`/dashboard/details/${stock.symbol}`}>
                                        {stock.symbol}</NavLink></td>
                                {showPortfolioItems &&
                                    <>
                                        <td data-label="Avg Price Bought">${(stock.averagePriceBought).toFixed(2)}</td>
                                        <td data-label="Quantity on Hand">{stock.totalQuantity}</td>
                                        <td data-label="Market Value">${stock.totalQuantity * stock.currentPrice}</td>
                                        <td data-label="Industry">{stock.industry}</td>
                                        <td data-label="Market Cap">{(stock.marketCap/1000000).toFixed(0)}</td>
                                    </>

                                }


                                <td data-label="Latest Price">${stock.currentPrice}</td>
                                <td data-label="% Change"
                                    className={`${(stock.price_change.toString().charAt(0) === "-") ? "red" : "green"}`}>
                                    {stock.percent_change}%</td>
                                <td data-label="Volume Transacted">{stock.volume}</td>
                                <td data-label="Prediction"
                                    className={`${stock.yhat_30_advice === "BUY" && "green"} 
                                                ${stock.yhat_30_advice == "HOLD" && "orange"}  
                                                ${stock.yhat_30_advice == "SELL" && "red"}`}>
                                    {stock.yhat_30_advice}</td>
                                <td>
                                    <span className="material-icons">

                                    {showRemove &&
                                    <span className="material-icons-outlined"
                                          onClick={() => removeFromTable(stock.id)}>
                                        close
                                    </span>}

                                    {showAddToWatchlist &&
                                    <span className="material-icons-outlined"
                                          onClick={()=>addToTable(stock.id)}>
                                        playlist_add
                                    </span>}

                                    <span className="material-icons-outlined"
                                          id={stock.id}
                                          symbol={stock.symbol}
                                          name = {stock.name}
                                          price = {stock.currentPrice}
                                          onClick={handleShow}>
                                        add</span>
                                    </span>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddStockModal stockToAdd={stockToAdd} setShow={setShow} show={show} />
        </>
    );
}

export default DashTable;
