import React from "react";
import './CollapseTable.css'

const CollapseTable = (props) => {
    const handleRowClick = (index) => {props.handelRowClick(index)};
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact Number</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Cuisine</th>
                    <th>Qualification</th>
                    <th>Salary</th>
                </tr>
            </thead>
            <tbody>
                {props.data.map((row, index) => (
                    <tr onClick={() => handleRowClick(index)} style={{ cursor: "pointer" }} key={index}>
                        <td data-label="Name" title={row.name}><div className="data-cell">{row.name}</div></td>
                        <td data-label="Contact Number" title={row.contactNumber}><div className="data-cell">{row.contactNumber}</div></td>
                        <td data-label="Email" title={row.email}><div className="data-cell">{row.email}</div></td>
                        <td data-label="City" title={row.city}><div className="data-cell">{row.city}</div></td>
                        <td data-label="State" title={row.state}><div className="data-cell">{row.state}</div></td>
                        <td data-label="Cuisine" title={row.cuisine.join(",")}><div className="data-cell">{row.cuisine.join(",")}</div></td>
                        <td data-label="Qualification" title={row.qualification}><div className="data-cell">{row.qualification}</div></td>
                        <td data-label="Salary" title={row.salary}><div className="data-cell">{row.salary}</div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CollapseTable;
