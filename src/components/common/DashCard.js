import React from 'react';

function DashCard({title='title', value='content'}) {
    return (
        <div className="d-flex flex-column dash-card-block">
            <div className="list--title">{title}</div>
            <div className="card">
                {value}
            </div>
        </div>
    );
}

export default DashCard;