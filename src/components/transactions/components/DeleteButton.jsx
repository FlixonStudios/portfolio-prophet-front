import React from 'react';
import { portfolioService } from '../../../services/portfolio';


function DeleteButton({ style, transaction, onUpdate }) {
    const onPress = () => {
        portfolioService.deleteTransaction(transaction.id).then(()=>{
            onUpdate();
        });
    }
    return <button style={style} onClick={onPress}>Delete</button>
}

export default DeleteButton
