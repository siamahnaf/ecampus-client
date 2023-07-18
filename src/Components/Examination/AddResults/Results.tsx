import { useState, ChangeEvent } from "react";
import { Icon } from "@iconify/react";

//Components
import SingleInput from "./SingleInput";

//Urql
import { SubjectResultData } from "@/Urql/Types/Examination/result.types";

//Interface
interface Props {
    results: SubjectResultData[];
}

const Results = ({ results }: Props) => {
    //State
    const [students, setStudent] = useState<SubjectResultData[]>(results);
    const [value, setValue] = useState<string>();

    //OnChange Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
        setValue(inputValue)
        try {
            const regex = new RegExp(inputValue, "i");
            const filteredList = results.filter((student) =>
                regex.test(student.studentId.name)
            );
            setStudent(filteredList);
        } catch (error) {
            setStudent([]);
        }
    };
    return (
        <div className="mt-10">
            <div className="flex gap-8 items-center">
                <p className="text-base uppercase font-semibold">Student List</p>
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input w-full rounded-3xl input-sm bg-textColor bg-opacity-5 focus:outline-none pl-14 py-[18px]"
                        onChange={onChange}
                    />
                    <Icon icon="material-symbols:search" className="text-xl absolute top-2/4 left-6 -translate-y-2/4" />
                </div>
            </div>
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Roll</th>
                            <th className="bg-primary capitalize text-main font-medium">Name</th>
                            <th className="bg-primary capitalize text-main font-medium">ID</th>
                            <th className="bg-primary capitalize text-main font-medium">CQ</th>
                            <th className="bg-primary capitalize text-main font-medium">MCQ</th>
                            <th className="bg-primary capitalize text-main font-medium">Practical</th>
                            <th className="bg-primary capitalize text-main font-medium">CA</th>
                            <th className="bg-primary capitalize text-main font-medium">Total</th>
                            <th className="bg-primary capitalize text-main font-medium">Full Marks</th>
                            <th className="bg-primary capitalize text-main font-medium">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 && students.map((item, i) => (
                            <tr key={i}>
                                <td>{item.studentId.roll}</td>
                                <td>{item.studentId.name}</td>
                                <td>{item.studentId.studentId}</td>
                                <SingleInput item={item} />
                            </tr>
                        ))}
                        {students.length === 0 && value &&
                            <tr>
                                <td colSpan={9} className="text-center text-main font-medium text-base py-4">
                                    Nothing found &quot;{value}&quot;
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Results;