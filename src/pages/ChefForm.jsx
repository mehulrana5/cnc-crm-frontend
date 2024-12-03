import React, { useState } from 'react';
import './ChefForm.css';
import MultiRangeSlider from '../components/ui/MultiRangeSlider';
import CollapseTable from '../components/CollapseTable';
import LeadFormModal from '../components/LeadFormModal';

function ChefForm() {

    const initialFilters = {
        city_1: '', state_1: '', cuisine_1: '', nameEmailContact: '', qualification_1: '', salaryRange: [0, 100000]
    }

    const initialLeadForm = {
        name_2: '', contactNumber_2: '', email_2: '', city_2: '', state_2: '', role: [], salary: '', experience: '', designation: '', qualification_2: '', remarks_2: '', cuisine_2: '', sharedFor: ''
    }

    const filterOptions = [
        { label: 'City', name: 'city_1' },
        { label: 'State', name: 'state_1' },
        { label: 'Qualification', name: 'qualification_1' },
        { label: "Name / Email / Contact", name: 'nameEmailContact' },
        { label: 'Cuisine', name: 'cuisine_1' }
    ]

    const leadFormBasicDetails = [
        { label: 'Name', name: 'name_2' },
        { label: 'Contact Number', name: 'contactNumber_2' },
        { label: 'Email', name: 'email_2' },
        { label: 'City', name: 'city_2' },
        { label: 'State', name: 'state_2' }
    ]

    const leadFormProfessionalDetails = [
        { label: 'Experience', name: 'experience' },
        { label: 'Cuisines', name: 'cuisine_2' },
        { label: 'Designation', name: 'designation' },
        { label: 'Qualification', name: 'qualification_2' },
        { label: 'Remarks', name: 'remarks_2' },
        { label: 'Shared For', name: 'sharedFor' }
    ]

    // --------------useState starts---------------------

    const [filters, setFilters] = useState(initialFilters);
    const [leadForm, setLeadForm] = useState(initialLeadForm);
    const [filterReset, setFilterReset] = useState(false)
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [filterData, setFilterData] = useState();
    const [clickedBtn, setClickedBtn] = useState(0)
    const [selectedDataPoint, setSelectedDataPoint] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 5;
    var totalPages = Math.ceil(totalItems / itemsPerPage)

    // --------------useState ends-----------------------

    // --------------functions---------------------------
    const formatResponce = (backendResponse) => {
        const transformedData = backendResponse.data.leads.map((lead) => ({
            _id: lead._id,
            name: lead.name,
            contactNumber: lead.contact,
            email: lead.email,
            city: lead.city,
            state: lead.state,
            cuisine: lead?.cuisines || [],
            qualification: lead.qualification,
            salary: lead.salary.toString(),
            role: lead?.roles || [],
            experience: 1,
            designation: lead.designation,
            remarks: lead?.remarks || ["abcd"],
            sharedFor: lead.sharedFor,
        }));
        return transformedData
    }

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        setErrors({ ...errors, [name]: '' })
        if (formType === 'filters') {
            setFilters({ ...filters, [name]: value });
        } else {
            setLeadForm({ ...leadForm, [name]: value });
        }
    };

    const handleRoleChange = (e) => {
        const { value, checked } = e.target;
        setLeadForm((prevLeadForm) => ({
            ...prevLeadForm,
            role: checked
                ? [...prevLeadForm.role, value]
                : prevLeadForm.role.filter((role) => role !== value),
        }));
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setFilterReset(true)
        setErrors({})
        setFilterData()
        setSelectedDataPoint(null)
    };

    const handleClearLead = () => {
        setLeadForm(initialLeadForm);
        setErrors({})
    };

    const validateSearch = () => {
        var temp = {
            // nameEmailContact : 'Invalid Name/Email/Contact'
        };
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const validateLeadForm = () => {
        var temp = {}
        if (leadForm?.role.length === 0) {
            temp['role'] = 'Select atleast 1 role'
        }
        setErrors(temp)
        return Object.keys(temp).length === 0;
    }

    const getLeads = async (idx) => {
        var offset = 0 * itemsPerPage
        if (idx) {
            offset = (idx - 1) * itemsPerPage
            setCurrentPage(idx - 1)
        }
        setLoading(true);
        setClickedBtn(1)
        setFilterData()
        setSelectedDataPoint(null)
        if (!validateSearch()) {
            setLoading(false);
            return;
        }
        setErrors({});
        try {
            console.log(`offset=${offset}`);
            const body = { "offset": offset, "limit": itemsPerPage, "filters": { "category": "chef", "createdBy": "abc@gmail.com" } }
            const response = await fetch("http://crm.cookandchef.in/api/v1/crm/getLeads", {
                method: "POST",
                body: JSON.stringify(body),
            });
            const data = await response.json()
            setTotalItems(data.data.count)
            const formatedResponce = formatResponce(data)
            setFilterData(formatedResponce);
        }
        catch (error) { console.error('Error fetching data:', error); }
        setLoading(false);
        setClickedBtn(0)
    };

    const handelAddLead = async () => {
        if (!validateLeadForm()) return;
        setErrors({});
        setLoading(true);
        setClickedBtn(2)
        const body = {
            name: leadForm.name_2 || "testName-5",
            contact: leadForm.contactNumber_2 || "testContact",
            category: leadForm?.category || "chef",
            roles: leadForm.role,
            cuisines: leadForm.cuisine_2.split(",") || ['c1', 'c2'],
            salary: parseInt(leadForm.salary) || 20000,
            city: leadForm.city_2 || "test",
            remarks: leadForm.remarks_2 || "abc",
            state: leadForm.state_2 || "test",
            qualification: leadForm.qualification_2 || "qualificationtest",
            relocation: leadForm?.relocation || false,
            sharedFor: leadForm.sharedFor || "testSharedFor",
            email: leadForm.email_2 || "test@gmail.com",
            designation: leadForm.designation || "test-design",
            createdBy: "abc@gmail.com",
        };
        const headers = { "Content-Type": "application/json", };
        try {
            const response = await fetch("http://crm.cookandchef.in/api/v1/crm/leads", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
            const data = await response.json()
            if (data.success) {
                alert('Lead has been added')
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
        handleClearLead()
        setLoading(false);
        setClickedBtn(0)
    };

    const handelInputType = (type) => {
        switch (type) {
            case 'Email':
                return 'email'
            case 'Contact Number':
                return 'tel'
            default:
                return 'text'
        }
    }

    const handelInputPattern = (type) => {
        switch (type) {
            case 'Email':
                return '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
            case 'Contact Number':
                return '^\\+?[0-9]{10,15}$'
            default:
                return ''
        }
    }

    const handelRowClick = (idx) => {
        if (selectedDataPoint === idx) {
            setSelectedDataPoint(null);
            setTimeout(() => setSelectedDataPoint(idx), 0);
        } else {
            setSelectedDataPoint(idx);
        }
    }

    // --------------functions ends----------------------

    return (
        <>
            <div className="chef-form">
                <div className="lang-and-profile-container">
                    <div className="user-icon">
                        <img src="https://via.placeholder.com/56" alt="User Icon" />
                    </div>
                </div>
                <h1 className="title">Chef</h1>
                <div className="filters-container">
                    <h2 className='sub-title-1'>Filters</h2>
                    <div className="filters">
                        {filterOptions.map((field, index) => (
                            <div key={index} className="input-group">
                                <label htmlFor={field.name}>{field.label}</label>
                                <input
                                    type={handelInputType(field.label)}
                                    id={field.name}
                                    name={field.name}
                                    value={filters[field.name]}
                                    onChange={(e) => handleInputChange(e, 'filters')}
                                    pattern={handelInputPattern(field.label)}
                                />
                                <span className="error-container">{errors[field.name]}</span>
                            </div>
                        ))}
                        <div className="input-group">
                            <label htmlFor="salaryRange">Salary Range</label>
                            <MultiRangeSlider
                                min={0}
                                max={100000}
                                onChange={({ min, max }) => {
                                    setFilters({ ...filters, salaryRange: [min, max] })
                                    setFilterReset(false)
                                }}
                                step={100}
                                reset={filterReset}
                            />
                        </div>
                    </div>
                    <div className="button-group">
                        <button className='reset-btn' onClick={handleReset}>Reset</button>
                        <button className="search-btn" onClick={() => getLeads()}>Search</button>
                    </div>
                </div>
                {
                    loading && clickedBtn === 1 ? <div className="filter-data-container">Loading....</div> :!loading && filterData ?
                            <>
                                <div className='select_page_container'>
                                    <h3>Page Number</h3>
                                    <select onChange={(e) => getLeads(parseInt(e.target.value, 10))} value={currentPage + 1} name="pageNumber" id="pageNumber">
                                        {Array.from({ length: totalPages }, (_, idx) => (
                                            <option key={idx + 1} value={idx + 1}>Page {idx + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-data-container">
                                    <CollapseTable data={filterData} handelRowClick={handelRowClick} />
                                    <LeadFormModal data={filterData[selectedDataPoint]} />
                                </div>
                            </>
                            : <></>
                }
                <div className="lead-form-container">
                    <h2 className='sub-title-1'>Lead Form</h2>
                    {
                        loading && clickedBtn === 2 ?
                            <div className="filter-data-container">Loading....</div> :
                            <>
                                <h3 className='sub-title-2'>Basic Details</h3>
                                <div className="lead-form">
                                    {leadFormBasicDetails.map((field, index) => (
                                        <div key={index} className="input-group">
                                            <label htmlFor={field.name}>{field.label}</label>
                                            <input
                                                type={handelInputType(field.label)} id={field.name}
                                                name={field.name}
                                                value={leadForm[field.name]}
                                                onChange={(e) => handleInputChange(e, 'leadForm')}
                                            />
                                            <span className="error-container">{errors[field.name]}</span>
                                        </div>
                                    ))}
                                    <div></div>
                                    <div className="input-group">
                                        <label>Role*</label>
                                        <div>
                                            <div className='custom-checkbox-container'>
                                                <input className="custom-checkbox" type="checkbox" value="Chef" onChange={handleRoleChange} checked={leadForm.role.includes('Chef')} id="chefCheckBox" />
                                                <label htmlFor="chefCheckBox">Chef Role</label>
                                            </div>
                                            <div className='custom-checkbox-container'>
                                                <input className="custom-checkbox" type="checkbox" value="Party Cook" onChange={handleRoleChange} checked={leadForm.role.includes('Party Cook')} id="partyCookCheckBox" />
                                                <label htmlFor="partyCookCheckBox">Party Cook Role</label>
                                            </div>
                                        </div>
                                        <span className="error-container">{errors['role']}</span>
                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <h3 className='sub-title-2'>Professional Details</h3>
                                <div className='lead-form'>
                                    <div className="input-group">
                                        <label htmlFor="salary">Salary</label>
                                        <input type="number" name="Salary" id="Salary" min={0} />
                                    </div>
                                    {leadFormProfessionalDetails.map((field, index) => (
                                        <div key={index} className="input-group">
                                            <label htmlFor={field.name}>{field.label}</label>
                                            <input
                                                type='text'
                                                id={field.name}
                                                name={field.name}
                                                value={leadForm[field.name]}
                                                onChange={(e) => handleInputChange(e, 'leadForm')}
                                            />
                                            <span className="error-container">{errors[field.name]}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                    }
                </div>
                <div className="button-group">
                    <button className='clear-lead-btn' onClick={handleClearLead}>Clear Lead</button>
                    <button className="add-lead-btn" onClick={handelAddLead}>Add Lead</button>
                </div>
            </div>
        </>
    );
}

export default ChefForm;