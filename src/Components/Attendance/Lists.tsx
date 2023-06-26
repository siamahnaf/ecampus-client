import { useEffect, useState, ChangeEvent } from "react";
import { Radio } from "@material-tailwind/react";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, CombinedError } from "urql";
import { ADD_PRESENT } from "@/Urql/Query/Attendance/attendance.query";
import { AddPresentData, StudentAttendanceList } from "@/Urql/Types/Attendance/attendance.types";

//Interface
interface Props {
    students: StudentAttendanceList[]
    studentError: CombinedError
}

const Lists = ({ students, studentError }: Props) => {
    //State
    const [notification, setNotification] = useState<boolean>(false);

    //Urql
    const [{ error }, addPresent] = useMutation<AddPresentData>(ADD_PRESENT);

    //Handler
    const onAddPresent = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        const presentData = {
            id: id,
            present: e.target.value
        }
        addPresent({ presentInput: presentData })
    };

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Lifecycle hook
    useEffect(() => {
        if (error) {
            setNotification(true);
        }
    }, [error])

    return (
        <div className="mb-8 mt-8">
            {error &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={"error"}
                >
                    {error?.message}
                </Notification>
            }
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Student ID</th>
                            <th className="bg-primary capitalize text-main font-medium">Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Roll</th>
                            <th className="bg-primary capitalize text-main font-medium">Session</th>
                            <th className="bg-primary capitalize text-main font-medium">Class</th>
                            <th className="bg-primary capitalize text-main font-medium">Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((item, i) => (
                            <tr key={i}>
                                <td>{item.student?.studentId}</td>
                                <td>{item.student?.name}</td>
                                <td>{item.student?.roll}</td>
                                <td>{item.student?.session}</td>
                                <td>{item.student?.class?.name}</td>
                                <td className="flex gap-3">
                                    <div className="flex gap-8">
                                        <Radio id={item.student?.studentId + "1"} name={item.student?.studentId} label="Present" color="green" value="present" defaultChecked={item.present === "present"} onChange={(e) => onAddPresent(e, item.id)} />
                                        <Radio id={item.student?.studentId + "2"} name={item.student?.studentId} label="Absent" color="red" value="absent" defaultChecked={item.present === "absent"} onChange={(e) => onAddPresent(e, item.id)} />
                                        <Radio id={item.student?.studentId + "3"} name={item.student?.studentId} label="Late" color="yellow" value="late" defaultChecked={item.present === "late"} onChange={(e) => onAddPresent(e, item.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    No student data found!
                                </td>
                            </tr>
                        }
                        {studentError &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    {error?.message}
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