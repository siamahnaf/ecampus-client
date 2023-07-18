import { Fragment, useState, useEffect, ChangeEvent } from "react";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation } from "urql";
import { UPDATE_MARKS } from "@/Urql/Query/Examination/result.query";
import { UpdateMarksData, SubjectResultData } from "@/Urql/Types/Examination/result.types";

//interface
interface Props {
    item: SubjectResultData
}

const SingleInput = ({ item }: Props) => {
    //State
    const [cq, setCq] = useState<string>(item.marks[0].cq?.toString() || "");
    const [mcq, setMcq] = useState<string>(item.marks[0].mcq?.toString() || "");
    const [practical, setPractical] = useState<string>(item.marks[0].practical?.toString() || "");
    const [ca, setCa] = useState<string>(item.marks[0].ca?.toString() || "");
    const [notification, setNotification] = useState(false);

    //Debounce Timer
    let debounceTimer: NodeJS.Timeout;

    //Urql
    const [{ error }, updateMarks] = useMutation<UpdateMarksData>(UPDATE_MARKS)

    //Cq Onchange
    const cqOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        setCq(e.target.value);
        const newCq = e.target.value
        clearTimeout(debounceTimer);
        const gradeData = item.gradeId.grades.find(item => (Number(newCq) + Number(mcq) + Number(practical) + Number(ca)) >= Number(item.percent_from) && (Number(newCq) + Number(mcq) + Number(practical) + Number(ca)) <= Number(item.percent_upto));
        const ApiData = {
            totalMarks: (Number(newCq) + Number(mcq) + Number(practical) + Number(ca)),
            cq: e.target.value ? Number(e.target.value) : null,
            grade: gradeData?.name,
            grade_point: gradeData?.grade_point
        }
        debounceTimer = setTimeout(() => {
            if (item.marks[0].fullMarks >= (Number(newCq) + Number(mcq) + Number(practical) + Number(ca))) {
                updateMarks({ marksInput: ApiData, updateMarksId: item.marks[0].id });
            }
        }, 500);
    }

    console.log(item.marks);

    //Cq Onchange
    const mcqOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        setMcq(e.target.value);
        const newMcq = e.target.value
        clearTimeout(debounceTimer);
        const gradeData = item.gradeId.grades.find(item => (Number(cq) + Number(newMcq) + Number(practical) + Number(ca)) >= Number(item.percent_from) && (Number(cq) + Number(newMcq) + Number(practical) + Number(ca)) <= Number(item.percent_upto));
        const ApiData = {
            totalMarks: (Number(cq) + Number(newMcq) + Number(practical) + Number(ca)),
            mcq: e.target.value ? Number(e.target.value) : null,
            grade: gradeData?.name,
            grade_point: gradeData?.grade_point
        }
        debounceTimer = setTimeout(() => {
            if (item.marks[0].fullMarks >= (Number(cq) + Number(newMcq) + Number(practical) + Number(ca))) {
                updateMarks({ marksInput: ApiData, updateMarksId: item.marks[0].id });
            }
        }, 500);
    }

    //Cq Onchange
    const practicalOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        setPractical(e.target.value);
        const newPractical = e.target.value;
        clearTimeout(debounceTimer);
        const gradeData = item.gradeId.grades.find(item => (Number(cq) + Number(mcq) + Number(newPractical) + Number(ca)) >= Number(item.percent_from) && (Number(cq) + Number(mcq) + Number(newPractical) + Number(ca)) <= Number(item.percent_upto));
        const ApiData = {
            totalMarks: (Number(cq) + Number(mcq) + Number(newPractical) + Number(ca)),
            practical: e.target.value ? Number(e.target.value) : null,
            grade: gradeData?.name,
            grade_point: gradeData?.grade_point
        }
        debounceTimer = setTimeout(() => {
            if (item.marks[0].fullMarks >= (Number(cq) + Number(mcq) + Number(newPractical) + Number(ca))) {
                updateMarks({ marksInput: ApiData, updateMarksId: item.marks[0].id });
            }
        }, 500);
    }

    //Cq Onchange
    const caOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        setCa(e.target.value);
        const newCa = e.target.value;
        clearTimeout(debounceTimer);
        const gradeData = item.gradeId.grades.find(item => (Number(cq) + Number(mcq) + Number(practical) + Number(newCa)) >= Number(item.percent_from) && (Number(cq) + Number(mcq) + Number(practical) + Number(newCa)) <= Number(item.percent_upto));
        const ApiData = {
            totalMarks: (Number(cq) + Number(mcq) + Number(practical) + Number(newCa)),
            ca: e.target.value ? Number(e.target.value) : null,
            grade: gradeData?.name,
            grade_point: gradeData?.grade_point
        }
        debounceTimer = setTimeout(() => {
            if (item.marks[0].fullMarks >= (Number(cq) + Number(mcq) + Number(practical) + Number(newCa))) {
                updateMarks({ marksInput: ApiData, updateMarksId: item.marks[0].id });
            }
        }, 500);
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };


    //UseEffect
    useEffect(() => {
        setNotification(true)
    }, [error])

    return (
        <Fragment>
            {error &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={"error"}
                >
                    {error?.message}
                </Notification>
            }
            <td>
                <input
                    type="text"
                    className={`input input-bordered input-sm max-w-xs w-24 focus:outline-none placeholder:text-textColor ${item.marks[0].fullMarks < (Number(cq) + Number(mcq) + Number(practical) + Number(ca)) ? "border-red-600" : ""}`}
                    placeholder="-"
                    onChange={cqOnchange}
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value.replace(/[^0-9]/g, '');
                        const maxLength = item.marks[0].fullMarks.toString().length;
                        e.target.value = inputValue.slice(0, maxLength);
                    }}
                    value={cq}
                />
            </td>
            <td>
                <input
                    type="text"
                    className={`input input-bordered input-sm max-w-xs w-24 focus:outline-none placeholder:text-textColor ${item.marks[0].fullMarks < (Number(cq) + Number(mcq) + Number(practical) + Number(ca)) ? "border-red-600" : ""}`}
                    placeholder="-"
                    onChange={mcqOnchange}
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value.replace(/[^0-9]/g, '');
                        const maxLength = item.marks[0].fullMarks.toString().length;
                        e.target.value = inputValue.slice(0, maxLength);
                    }}
                    value={mcq}
                />
            </td>
            <td>
                <input
                    type="text"
                    className={`input input-bordered input-sm max-w-xs w-24 focus:outline-none placeholder:text-textColor ${item.marks[0].fullMarks < (Number(cq) + Number(mcq) + Number(practical) + Number(ca)) ? "border-red-600" : ""}`}
                    placeholder="-"
                    onChange={practicalOnchange}
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value.replace(/[^0-9]/g, '');
                        const maxLength = item.marks[0].fullMarks.toString().length;
                        e.target.value = inputValue.slice(0, maxLength);
                    }}
                    value={practical}
                />
            </td>
            <td>
                <input
                    type="text"
                    className={`input input-bordered input-sm max-w-xs w-24 focus:outline-none placeholder:text-textColor ${item.marks[0].fullMarks < (Number(cq) + Number(mcq) + Number(practical) + Number(ca)) ? "border-red-600" : ""}`}
                    placeholder="-"
                    onChange={caOnchange}
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value.replace(/[^0-9]/g, '');
                        const maxLength = item.marks[0].fullMarks.toString().length;
                        e.target.value = inputValue.slice(0, maxLength);
                    }}
                    value={ca}
                />
            </td>
            <td className={`${item.marks[0].fullMarks < (Number(cq) + Number(mcq) + Number(practical) + Number(ca)) ? "text-red-600" : ""}`}>
                {(Number(cq) === 0 && Number(mcq) === 0 && Number(practical) === 0 && Number(ca) === 0) ? "-" : (Number(cq) + Number(mcq) + Number(practical) + Number(ca))}
            </td>
            <td>
                {item.marks[0].fullMarks}
            </td>
            <td>
                {item.gradeId.grades.find(item => (Number(cq) + Number(mcq) + Number(practical) + Number(ca)) >= Number(item.percent_from) && (Number(cq) + Number(mcq) + Number(practical) + Number(ca)) <= Number(item.percent_upto))?.name}
            </td>
        </Fragment>
    );
};

export default SingleInput;