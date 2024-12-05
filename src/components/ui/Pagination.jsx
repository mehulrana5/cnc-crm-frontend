import React from 'react';

function Pagination({ triggerFunction, currentPage, totalPages }) {
    const styles = {
        select: {
            backgroundColor: '#ffffff',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
        },
        selectHover: {
            borderColor: '#bbb',
        },
        selectFocus: {
            borderColor: '#888',
            boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
        },
        container: {
            padding: '8px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            maxWidth: '250px',
        },
    };

    return (
        <div style={styles.container}>
            <h3>Page Number</h3>
            <select
                style={styles.select}
                onChange={(e) => triggerFunction(parseInt(e.target.value, 10))}
                value={currentPage + 1}
                name="pageNumber"
                id="pageNumber"
            >
                {Array.from({ length: totalPages }, (_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                        Page {idx + 1}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Pagination;
