import React from 'react';

function DashCard({title='title'}) {
    return (
        <div className="d-flex flex-column dash-card-block">
            <div className="list--title">{title}</div>
            <div className="card">
                content
            </div>
        </div>
    );
}

export default DashCard;