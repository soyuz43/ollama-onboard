// src/components/TextSanitizer.jsx

import React, { useState } from 'react';

export const TextSanitizer = () => {
    const [text, setText] = useState('');
    const [isUpperCase, setIsUpperCase] = useState(false);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const trimText = () => {
        setText(text.trim());
    };

    const removeExtraSpaces = () => {
        setText(text.replace(/\s+/g, ' '));
    };

    const titleCaseText = () => {
        setText(text.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase()));
    };

    const sentenceCaseText = () => {
        setText(text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, m => m.toUpperCase()));
    };

    const toggleCaseText = () => {
        setText(isUpperCase ? text.toLowerCase() : text.toUpperCase());
        setIsUpperCase(!isUpperCase);
    };

    return (
        <div className="text-sanitizer">
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text here..."
                className="sanitizer-input"
            
            ></textarea>
            <div className="buttons">
                <button onClick={trimText}>Trim Edges</button>
                <button onClick={removeExtraSpaces}>Remove Extra Spaces</button>
                <button onClick={titleCaseText}>Title Case</button>
                <button onClick={sentenceCaseText}>Sentence Case</button>
                <button onClick={toggleCaseText}>{isUpperCase ? 'Lower Case' : 'All Caps'}</button>
            </div>
        </div>
    );
};
