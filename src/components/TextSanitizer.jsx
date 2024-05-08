// src/components/TextSanitizer.jsx

import React, { useState } from 'react';

export const TextSanitizer = () => {
    const [text, setText] = useState('');

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const trimText = () => {
        setText(text.trim());
    };

    const removeExtraSpaces = () => {
        setText(text.replace(/\s+/g, ' '));
    };

    const capitalizeText = () => {
        setText(text.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase()));
    };

    return (
        <div className="text-sanitizer">
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text here..."
                className="sanitizer-input"
                style={{ width: '100%', minHeight: '150px' }}
            ></textarea>
            <div className="buttons">
                <button onClick={trimText}>Trim Edges</button>
                <button onClick={removeExtraSpaces}>Remove Extra Spaces</button>
                <button onClick={capitalizeText}>Capitalize</button>
            </div>
        </div>
    );
};


