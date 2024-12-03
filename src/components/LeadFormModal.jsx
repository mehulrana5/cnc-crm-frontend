import React, { useEffect, useState } from 'react'
import css from './LeadFormModal.module.css'
import axios from 'axios';
import RemarksModal from './RemarksModal.jsx'

function LeadFormModal(props) {

  const initialLeadForm = {
    name_2: props?.data?.name,
    contactNumber_2: props?.data?.contactNumber,
    email_2: props?.data?.email,
    city_2: props?.data?.city,
    state_2: props?.data?.state,
    role: props?.data?.role || [],
    salary: props?.data?.salary,
    experience: props?.data?.experience,
    designation: props?.data?.designation,
    qualification_2: props?.data?.qualification,
    remarks_2: props?.data?.remarks,
    cuisine_2: props?.data?.cuisine || [],
    sharedFor: props?.data?.sharedFor
  };

  const leadFormBasicDetails = [
    { label: 'Name', name: 'name_2' },
    { label: 'Contact Number', name: 'contactNumber_2' },
    { label: 'Email', name: 'email_2' },
    { label: 'City', name: 'city_2' },
    { label: 'State', name: 'state_2' }
  ]

  const leadFormProfessionalDetails = [
    { label: 'Salary', name: 'salary' },
    { label: 'Experience', name: 'experience' },
    { label: 'Cuisines', name: 'cuisine_2' },
    { label: 'Designation', name: 'designation' },
    { label: 'Qualification', name: 'qualification_2' },
  ]

  const [leadForm, setLeadForm] = useState(initialLeadForm);
  const [closeModal, setCloseModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [clickedBtn, setClickedBtn] = useState(0)
  const [closeRemarks, setCloseRemarks] = useState(true)
  const [disableSave, setDisableSave] = useState(true)

  useEffect(() => {
    setDisableSave(true)
    setCloseModal(false)
    setLeadForm(initialLeadForm)
    // eslint-disable-next-line
  }, [props.data])

  const handleCloseModal = () => {
    setLeadForm({})
    setCloseModal(true)
  }

  const handelOnChange = (e) => {
    setLeadForm({ ...leadForm, [e.target.name]: e.target.value })
    setDisableSave(false)
  }

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    let updatedRoles = [...(leadForm.role || [])];
    let role = '';
    if (name === 'check_box_1') {
      role = 'chef';
    } else if (name === 'check_box_2') {
      role = 'party cook';
    }
    if (checked && role) {
      if (!updatedRoles.includes(role)) {
        updatedRoles.push(role);
      }
    } else if (!checked && role) {
      updatedRoles = updatedRoles.filter((r) => r !== role);
    }
    setLeadForm({ ...leadForm, role: updatedRoles });
  };

  const validateInput = () => {
    return true
  }

  const handelOpenRemarks = () => {
    setCloseRemarks(!closeRemarks)
  }

  const handelSaveChanges = async () => {
    console.log(leadForm);
    setIsLoading(true);
    setClickedBtn(1)
    if (validateInput(leadForm) === false) {
      setIsLoading(false);
      return
    }
    const body = {
      "name": leadForm.name_2,
      "contact": leadForm.contactNumber_2,
      "category": leadForm.category || "chef",
      "roles": leadForm.role,
      cuisines: typeof leadForm?.cuisine_2 === 'string'
        ? leadForm.cuisine_2.split(',')
        : leadForm.cuisine_2,
      "salary": +leadForm.salary,
      "city": leadForm.city_2,
      "state": leadForm.state_2,
      "qualification": leadForm.qualification_2,
      "relocation": leadForm.relocation || false,
      "sharedFor": leadForm.sharedFor,
      "email": leadForm.email_2,
      "designation": leadForm.designation,
      "updatedBy": leadForm.updatedBy || 'abc@gmail.com'
    }
    const url = `http://crm.cookandchef.in/api/v1/crm/leads/${props.data._id}/`
    try {
      const response = await fetch(url, { method: "PUT", body: JSON.stringify(body) })
      const data = await response.json()
      if (data?.success) {
        alert('Changes Saved');
        window.location.reload()
      }
    }
    catch (error) { alert(error.message); }
    setIsLoading(false);
    setClickedBtn(0)
  }

  const handelDeleteLead = async () => {
    const check = window.confirm("Do you want to delete this Lead?")
    if (check === false) {
      return
    }
    setClickedBtn(3)
    setIsLoading(true)
    try {
      const responce = await axios.delete(`http://crm.cookandchef.in/api/v1/crm/leads/${props?.data?._id}`)
      if (responce?.data) {
        alert("Lead has been deleted")
        window.location.reload()
      }
    }
    catch (error) { alert(error.message); }
    setClickedBtn(0)
    setIsLoading(false)
  }

  return (
    <>
      {
        props.data === undefined || closeModal ? <></> :
          <div>
            <div className={css.modal_lead_form_container}>
              <div className={css.container_2}>
                <div className={css.container_3}>
                  <div className={css.container_6}>
                    <h2 className={css.sub_title_1}>Lead Form</h2>
                    <div className={css.close_modal} onClick={handleCloseModal}>
                      <div className={`${css.close_modal_lines} ${css.close_modal_line_1}`}></div>
                      <div className={`${css.close_modal_lines} ${css.close_modal_line_2}`}></div>
                    </div>
                  </div>
                  <hr style={{ width: "100%" }} />
                  <div className={css.container_4}>
                    {
                      clickedBtn === 1 && isLoading ? <>Loading....</> :
                        <button id='save_changes_btn' className={`${css.blue_btn} ${css.btn}`} onClick={handelSaveChanges} disabled={disableSave}>Save</button>
                    }
                    {
                      clickedBtn === 3 && isLoading ? <>Loading....</> :
                        <button className={`${css.red_btn} ${css.btn}`} onClick={handelDeleteLead}>Delete</button>
                    }
                    <button className={`${css.blue_btn} ${css.btn}`} onClick={handelOpenRemarks}>Remarks</button>
                  </div>
                </div>
              </div>
              <div className={css.container_1}>
                <div className="modal-lead-form">
                  <h3 className={css.sub_title_2}>Basic Details</h3>
                  {leadFormBasicDetails.map((field, index) => (
                    <div key={index} className="input-group">
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={leadForm[field.name] || ''}
                        onChange={handelOnChange}
                      />
                    </div>
                  ))}
                  <div className="input-group">
                    <label>Role*</label>
                    <div>
                      <div className='custom-checkbox-container'>
                        <input
                          className="custom-checkbox"
                          type="checkbox"
                          value="Chef"
                          defaultChecked={leadForm.role.includes('chef')}
                          id="chefCheckBox"
                          name='check_box_1'
                          onChange={handleRoleChange}
                        />
                        <label htmlFor="chefCheckBox">ChefRole</label>
                      </div>
                      <div className='custom-checkbox-container'>
                        <input
                          className="custom-checkbox"
                          type="checkbox"
                          value="Party Cook"
                          defaultChecked={leadForm.role.includes('party cook')}
                          id="partyCookCheckBox"
                          name='check_box_2'
                          onChange={handleRoleChange}
                        />
                        <label htmlFor="partyCookCheckBox">PartyCookRole</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='modal-lead-form'>
                  <h3 className={css.sub_title_2}>Professional Details</h3>
                  {leadFormProfessionalDetails.map((field, index) => (
                    <div key={index} className="input-group">
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={leadForm[field.name] || ''}
                        onChange={handelOnChange}
                      />
                    </div>
                  ))}
                  {/* <div className="input-group">
                    <label htmlFor={'remarks_2'}>Remarks</label>
                    <div>
                      <input
                        type="text"
                        name='remarks_2'
                        id='remarks_2'
                        defaultValue={leadForm?.remarks_2}
                        onChange={handelOnChange}
                      />
                      {
                        clickedBtn === 2 && isLoading ? <div>Loading....</div> :
                          <button className={css.remark_save_btn} onClick={handelSave}>Save Remark</button>
                      }
                    </div>
                  </div> */}
                  <div className="input-group">
                    <label htmlFor={'sharedFor'}>Shared For</label>
                    <input
                      type="text"
                      id={'sharedFor'}
                      name={'sharedFor'}
                      value={leadForm['sharedFor'] || ''}
                      onChange={handelOnChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {closeRemarks === false ? <RemarksModal data={props.data.remarks} handelOpenRemarks={handelOpenRemarks} /> : <></>}
          </div>
      }
    </>
  )
}

export default LeadFormModal