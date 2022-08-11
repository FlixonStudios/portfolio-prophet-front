import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { portfolioService } from '../../../services/portfolio'

function TransactionModal({ setShow, show, context, defaultValue }) {
    let [transaction, setTransaction] = useState({
        ...defaultValue,
        dateAdded: new Date(),
    })

    const handleClose = () => setShow(false)

    async function addToPortfolio(e) {
        await portfolioService.addStockToPortfolio(transaction)
        handleClose()
    }

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
                    <Modal.Title>Add To Portfolio</Modal.Title>
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
                                defaultValue={defaultValue.dateAdded}
                            />
                        </Form.Group>
                        <Form.Group controlId="quantity">
                            <Form.Label>Qty</Form.Label>
                            <Form.Control
                                name={'quantity'}
                                type="text"
                                onChange={change}
                                defaultValue={defaultValue.quantity}
                            />
                        </Form.Group>
                        <Form.Group controlId="currency">
                            <Form.Label>Currency</Form.Label>
                            <Form.Control
                                as="select"
                                name={'currency'}
                                onChange={change}
                            >
                                <option value="SGD">SGD</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exchangeRateToSGD">
                            <Form.Label>Exchange Rate</Form.Label>
                            <Form.Control
                                name={'exchangeRateToSGD'}
                                type="text"
                                onChange={change}
                                defaultValue={defaultValue.exchangeRateToSGD}
                            />
                        </Form.Group>
                        <Form.Group controlId="currentPrice">
                            <Form.Label>Unit Price</Form.Label>
                            <Form.Control
                                name={'unitPrice'}
                                type="text"
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

export default TransactionModal
