import React, { PropTypes } from 'react';

import './stripes.scss';

export default function Stripes({ stripeWidth, vendorPrefix, topColorStyle, bottomColorStyle, windowWidth }) {
    const stripeStyle = {
        width: `${stripeWidth}px`,
        marginRight: `${stripeWidth}px`,
        backgroundImage: `${vendorPrefix}linear-gradient(${bottomColorStyle}, ${topColorStyle})`
    };
    const numOfStripes = Math.ceil(windowWidth / (stripeWidth * 2));
    let stripes = [];
    for (let i = 0; i < numOfStripes; i++) {
        stripes.push(<div className="orthofloat-stripe" style={stripeStyle} key={i} />);
    }

    return (
        <div className="orthofloat-stripes">
            {stripes}
        </div>
    );
}

Stripes.propTypes = {
    stripeWidth: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired,
    vendorPrefix: PropTypes.string.isRequired,
    topColorStyle: PropTypes.string.isRequired,
    bottomColorStyle: PropTypes.string.isRequired
};