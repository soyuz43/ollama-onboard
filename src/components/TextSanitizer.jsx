// src/components/TextSanitizer.jsx

import React, { useState, useEffect } from 'react';

export const TextSanitizer = () => {
    // Initialize text from localStorage if available, otherwise default to ''
    const [text, setText] = useState(() => {
        return localStorage.getItem('textSanitizerData') || '';
    });
    const [isUpperCase, setIsUpperCase] = useState(false);

    // Effect to store text in localStorage when text changes
    useEffect(() => {
        localStorage.setItem('textSanitizerData', text);
    }, [text]);

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
                style={{ minWidth: 400, minHeight: 300 }}
            
            ></textarea>
            <div className="buttons">
                <button onClick={trimText}>Trim Edges</button>
                <button onClick={removeExtraSpaces}>Remove Whitespace</button>
                <button onClick={titleCaseText}>Title Case</button>
                <button onClick={sentenceCaseText}>Sentence Case</button>
                <button onClick={toggleCaseText}>{isUpperCase ? 'Lower Case' : 'All Caps'}</button>
            </div>
        </div>
    );
};
