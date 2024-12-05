import React, { useState } from 'react'
import css from './RemarksModal.module.css'
import CloseBtn from './ui/CloseBtn';

function RemarksModal({ data, handelOpenRemarks }) {
    const [isLoading, setIsLoading] = useState(false)
    const [clickedBtn, setClickedBtn] = useState(-1)
    const [remarksState, setRemarksState] = useState(data?.map((field, idx) => ({ id: field?._id || idx, remark: field?.remark || '',updatedBy:field?.updatedBy, disabled: true })));

    const handelRemarkOnChange = (e, idx) => {
        const updatedRemarksState = [...remarksState];
        updatedRemarksState[idx] = {
            ...updatedRemarksState[idx],
            remark: e.target.value,
            disabled: false,
        };
        setRemarksState(updatedRemarksState);
    };

    const validateInput=(data)=>{
        return true
    }

    const handelUpdate = async (idx) => {
        setIsLoading(true);
        setClickedBtn(idx)
        const body = { remarks: remarksState.remark ,updatedBy:remarksState.updatedBy }
        if (validateInput(remarksState) === false) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(`http://crm.cookandchef.in/api/v1/crm/leads/${remarksState[idx].id}/remarks`, {
                method: "PUT",
                body: JSON.stringify(body)
            });
            const data=await response.json()
            if(data.success){
                alert("Remark has been updated")
            }
            else{
                alert(data.message)
            }
        }
        catch (error) { console.log(error); }
        setClickedBtn(-1)
        setIsLoading(false);
    };

    return (
        <div className={css.container_1}>
            <div className={css.container_5}>
                <h2 className={css.title}>Remarks</h2>
                <CloseBtn triggerFunction={handelOpenRemarks}/>
            </div>
            <hr />
            <div className={css.container_4}>
                {
                    data?.map((field, idx) => {
                        return (
                            <div key={idx} className={css.container_2}>
                                <div>
                                    <strong>Created By:</strong>{" "}
                                    {field?.updatedBy}{" "}
                                    ({new Date(field?.updatedAt).toLocaleString()})
                                </div>
                                <div className={css.container_3}>
                                    {
                                        isLoading && clickedBtn===idx?<>Loading...</>:
                                        <button
                                            className={`${css.btn} ${css.blue_btn}`}
                                            disabled={remarksState[idx]?.disabled}
                                            onClick={() => handelUpdate(idx)}
                                        >Update</button>
                                    }
                                    <textarea
                                        name="remarks"
                                        id={`remarks_${idx}`}
                                        defaultValue={field?.remark}
                                        onChange={(e) => handelRemarkOnChange(e, idx)
                                        }></textarea>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )


}

export default RemarksModal
