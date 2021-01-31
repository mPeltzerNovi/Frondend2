import React from 'react';


function Button({ children }) {
    return (
        <button type="button" className="super-leuke-button">
            { children }
        </button>
    );
};

export default Button;