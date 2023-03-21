import React, { useCallback, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { portfolioService } from '../../../services/portfolio'

function DividendModal({ setShow, show, context, defaultValue, getFunction }) {
    let [transaction, setTransaction] = useState({
        unitPrice: context.regularMarketPrice,
        symbol: context.symbol,
        fee: 0,
        dateAdded: new Date(),
        exchangeRateToSGD:
            context.records[context.records.length - 1].exchangeRateToSGD,
        quantity: context.quantity,
        ...defaultValue,
    })

    const handleClose = useCallback(() => setShow(false), [setShow], [])

    const addToPortfolio = useCallback(async () => {
        await portfolioService.addDividendToPortfolio(transaction)
        await getFunction()
        handleClose()
    }, [getFunction, handleClose, transaction])

    function change(e) {
        setTransaction((currState) => ({
            ...currState,
            ...{ [e.target.name]: e.target.value },
        }))
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Dividend From Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="stock">
                            <Form.Label>Stock</Form.Label>
                            <div>{context.shortName}</div>
                        </Form.Group>
                        <Form.Group controlId="symbol">
                            <Form.Label>Symbol</Form.Label>
                            <div>{context.symbol}</div>
                        </Form.Group>
                        <Form.Group controlId="Date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                name={'dateAdded'}
                                type="date"
                                onChange={change}
                                defaultValue={
                                    defaultValue
                                        ? defaultValue.dateAdded
                                        : new Date()
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="quantity">
                            <Form.Label>Qty</Form.Label>
                            <div>{context ? context.quantity : 0}</div>
                        </Form.Group>
                        <Form.Group controlId="currency">
                            <Form.Label>Currency</Form.Label>
                            <div>{context.currency}</div>
                        </Form.Group>
                        <Form.Group controlId="exchangeRateToSGD">
                            <Form.Label>Exchange Rate</Form.Label>
                            <Form.Control
                                name={'exchangeRateToSGD'}
                                type="number"
                                onChange={change}
                                defaultValue={transaction.exchangeRateToSGD}
                            />
                        </Form.Group>
                        <Form.Group controlId="currentPrice">
                            <Form.Label>Unit Price</Form.Label>
                            <Form.Control
                                name={'unitPrice'}
                                type="number"
                                onChange={change}
                                defaultValue={context.regularMarketPrice}
                            />
                        </Form.Group>
                        <Form.Group controlId="finalAmount">
                            <Form.Label>Final Amount</Form.Label>
                            <Form.Control
                                name={'finalAmount'}
                                type="number"
                                onChange={change}
                                defaultValue={0}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        type={'submit'}
                        onClick={addToPortfolio}
                    >
                        Add to Portfolio
                    </Button>
                    <Button className="btn-white" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DividendModal
