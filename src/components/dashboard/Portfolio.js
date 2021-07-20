import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import DashCard from "./common/DashCard";
import DashTable from "./common/DashTable";
import Axios from '../../lib/Axios'



function Portfolio() {

    let [portfolio, setPortfolio] = useState({})
    let [portfolioTransactions, setPortfolioTransactions] = useState([])

    useEffect(()=>{
        getPortfolioTransactions()
        //generatePortfolio()
    },[])

    async function getPortfolioTransactions(){
        let {data} = await Axios.get('/api/portfolio/')
        console.log(data['stock_dict'])
        console.log(data['portfolio_records'])
        // setPortfolioTransactions(data['portfolio_records'])
        generatePortfolio(data['portfolio_records'], data['stock_dict'])
    }
    async function deleteStockFromPortfolio(){
        let {data} = await Axios.post('/api/portfolio_delete/', {"id": "416294a0-d286-4f5f-a86a-834bb2679d2c"})
    }

    function generatePortfolio(pfTransactionArr, stockDict){
        let quantityMap = generateAggregatedObject(pfTransactionArr, 'stock','quantity');
        let averagePriceMap = generateAveragedObject(pfTransactionArr, 'stock', 'quantity', 'price');
        let portfolioArr = []

        for (let stockId in quantityMap) {
            let tempStockObj = {}
            if (!(quantityMap[stockId] === 0)){
                tempStockObj = {...stockDict[stockId],
                                'totalQuantity': quantityMap[stockId],
                                'averagePriceBought': averagePriceMap[stockId]}
                portfolioArr.push(tempStockObj)
            }
        }
        console.log(portfolioArr)
    }
    return (
    <>
        <h1>Portfolio</h1>
        <Row className="mb-4 no-gutters">
            <Col className="col-12 col-md-3">
                <DashCard title={'Current Value'} />
            </Col>
            <Col className="col-12 col-md-3">
                <DashCard title={'% Change'} />
            </Col>
        </Row>
        <Row className="mb-4 no-gutters">
            <Col className="col-12">
                <DashCard title={'Portfolio Growth over Time'} />
            </Col>
        </Row>
        <Row className="mb-4 no-gutters">
            <Col className="col-12">
                <DashTable />
            </Col>
        </Row>

    </>
    );
}

function generateAggregatedObject(arrayToAggregate, idName, value) {
    if (!arrayToAggregate) {
        return {}
    }
    let hashOfAggregation = {}
    for (let ele of arrayToAggregate) {
        if (!hashOfAggregation[ele[idName]]) {
            hashOfAggregation[ele[idName]] = 0
        }
        hashOfAggregation[ele[idName]] += ele[value]
    }
    return hashOfAggregation
}
function generateAveragedObject(arrayToAverage, idName, divisorKey, keyToAverage) {
    if (!arrayToAverage) {
        return {}
    }
    let hashOfAverage = {}
    let hashOfTotal = {}

    for (let ele of arrayToAverage) {
        if (!hashOfTotal[ele[idName]]) {
            hashOfTotal[ele[idName]] = [0,0]
        }
        hashOfTotal[ele[idName]][0] += ele[keyToAverage] * ele[divisorKey]
        hashOfTotal[ele[idName]][1] += ele[divisorKey]
    }

    for (let key in hashOfTotal) {
        if (!hashOfAverage[key]) {
            hashOfAverage[key] = hashOfTotal[key][0] / hashOfTotal[key][1]
        }
    }
    return hashOfAverage
}

export default Portfolio;
