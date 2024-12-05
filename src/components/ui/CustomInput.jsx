import React from 'react';

function CustomInput({ name, label, value, error, formType, triggerFunction }) {

    const style = {
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
        },
        inputField: {
            margin: '10px 0px',
            width: '70%',
            fontSize: 'larger',
            outline: 'none',
            border: 'none',
            borderBottom: '1px #00000052 solid',
            backgroundColor: 'rgba(255, 255, 255, 0)',
        },
        errorContainer: {
            color: 'red',
        },
    };

    const handelInputType = (type) => {
        switch (type) {
            case 'Email':
                return 'email';
            case 'Contact Number':
                return 'tel';
            case 'Salary':
                return 'number';
            default:
                return 'text';
        }
    };

    return (
        <div style={style.inputGroup}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                value={value}
                type={handelInputType(label)}
                onChange={(e) => triggerFunction(e, formType)}
                style={style.inputField}
            />
            {error && <span style={style.errorContainer}>{error}</span>}
        </div>
    );
}

export default CustomInput;
