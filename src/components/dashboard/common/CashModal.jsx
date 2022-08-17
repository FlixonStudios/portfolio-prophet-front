import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { portfolioService } from '../../../services/portfolio'

function CashModal({ setShow, show, action }) {
    let [transaction, setTransaction] = useState({
        unitPrice: 1,
        symbol: '_CASH',
        fee: 0,
        dateAdded: new Date(),
        exchangeRateToSGD: 1,
        region: 'SG',
        action,
        type: 'CAPITAL',
        account: 'CASH',
    })

    const handleClose = () => setShow(false)

    async function addToPortfolio(e) {
        const { exchangeRateToSGD, unitPrice, quantity } = transaction
        const finalTransaction = {
            ...transaction,
            finalAmount: exchangeRateToSGD * unitPrice * quantity,
        }
        await portfolioService.addStockToPortfolio(finalTransaction)
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
                            <Form.Label>Cash</Form.Label>
                        </Form.Group>

                        <Form.Group controlId="Date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                name={'dateAdded'}
                                type="date"
                                onChange={change}
                                defaultValue={
                                    transaction
                                        ? transaction.dateAdded
                                        : new Date()
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="quantity">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                name={'quantity'}
                                type="text"
                                onChange={change}
                                defaultValue={
                                    transaction ? transaction.quantity : 0
                                }
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
                                defaultValue={transaction.exchangeRateToSGD}
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

export default CashModal
