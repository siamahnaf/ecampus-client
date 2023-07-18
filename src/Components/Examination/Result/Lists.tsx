import { useState } from "react";
import { Icon } from "@iconify/react";

//Components
import Details from "./Details";

//Urql
import { ResultData } from "@/Urql/Types/Examination/result.types";

//Interface
interface Props {
    results: ResultData[]
}

const Lists = ({ results }: Props) => {
    //State
    const [value, setValue] = useState<string>("");
    const [details, setDetails] = useState<null | number>(null);


    //On Dialog Close
    const onDetailsHandler = () => {
        setDetails(null);
    }

    return (
        <div>
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Student Roll</th>
                            <th className="bg-primary capitalize text-main font-medium">Student Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Student ID</th>
                            <th className="bg-primary capitalize text-main font-medium">Grade</th>
                            <th className="bg-primary capitalize text-main font-medium">Grade Point</th>
                            <th className="bg-primary capitalize text-main font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, i) => (
                            <tr key={i}>
                                <td>{item.studentId.roll}</td>
                                <td>{item.studentId.name}</td>
                                <td>{item.studentId.studentId}</td>
                                <td>{item.marks.reduce((total, mark) => total + Number(mark.grade_point), 0) / item.marks.length}</td>
                                <td>{item.gradeId.grades.sort((a, b) => Number(b.grade_point) - Number(a.grade_point)).find(grade => Number(grade.grade_point) <= (item.marks.reduce((total, mark) => total + Number(mark.grade_point), 0) / item.marks.length))?.name}</td>
                                <td className="text-center">
                                    <div className="tooltip" data-tip="View">
                                        <button className="text-blue-500" onClick={() => setDetails(i)}>
                                            <Icon icon="mingcute:eye-2-fill" className="text-xl" />
                                        </button>
                                        <Details
                                            open={i === details}
                                            onClose={onDetailsHandler}
                                            result={item}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {results.length === 0 && !value &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    No Result Found for this class
                                </td>
                            </tr>
                        }
                        {results.length === 0 && value &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    Nothing Found &quot;{value}&quot;
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Lists;