import React from 'react';

function CloseBtn({ triggerFunction }) {
    const styles = {
        container1: {
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        },
        container2: {
            width: '20px',
            height: '2px',
            borderRadius: '20px',
            position: 'absolute',
            backgroundColor: '#1b1b1b',
        },
        line1: {
            transform: 'rotate(45deg)',
        },
        line2: {
            transform: 'rotate(-45deg)',
        },
    };

    return (
        <div style={styles.container1} onClick={triggerFunction}>
            <div style={{ ...styles.container2, ...styles.line1 }}></div>
            <div style={{ ...styles.container2, ...styles.line2 }}></div>
        </div>
    );
}

export default CloseBtn;
