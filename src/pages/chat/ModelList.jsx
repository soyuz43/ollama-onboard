import React, { useState, useEffect } from 'react';
import { fetchAvailableModels } from "../../services/chatService/OllamaAPIService.jsx";
import './ModelList.css'; // Import the CSS file

export const ModelList = () => {
    const [models, setModels] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        const fetchModels = async () => {
            const response = await fetch('http://localhost:11434/api/tags');
            const data = await response.json();
            setModels(data.models);
        };

        fetchModels();
    }, []);

    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    return (
        <div className="topMargin">
            {models.map((model, index) => (
                <div key={model.name} className="modelBox">
                    <h3>{model.name}</h3>
                    <p>Family: {model.details.family}</p>
                    <p>Parameter Size: {model.details.parameter_size}</p>
                    <p>Quantization Level: {model.details.quantization_level}</p>
                    <button onClick={() => toggleDropdown(index)}>
                        {dropdownOpen === index ? 'Hide Details' : 'Show Details'}
                    </button>
                    {dropdownOpen === index && (
                        <div style={{ margin: '10px', border: '1px solid #ccc', padding: '10px' }}>   
                            <p>Model: {model.model}</p>
                            <p>Modified At: {model.modified_at}</p>
                            <p>Size: {model.size}</p>
                            <p>Digest: {model.digest}</p>
                            <div>
                                <h5>Details</h5>
                                {Object.entries(model.details).map(([key, value]) => (
                                    <p key={key}><strong>{key}:</strong> {value}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ModelList;
