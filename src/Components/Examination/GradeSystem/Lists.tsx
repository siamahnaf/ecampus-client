import { useState, useEffect, Fragment } from "react";
import { Icon } from "@iconify/react";

//Components
import { Notification } from "@/Components/Common/Notification";
import Edit from "./Edit";
import Header from "./Header";

//Urql
import { useQuery, useMutation } from "urql";
import { GET_GRADE_SYSTEM, DELETE_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";
import { GetGradesData, DeleteGradeData } from "@/Urql/Types/Examination/grade.types";

const Lists = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [value, setValue] = useState<string>("");
    const [dialog, setDialog] = useState<null | string>(null);

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetGradesData>({
        query: GET_GRADE_SYSTEM,
        variables: { searchInput: { search: value } }
    });
    const [deleteData, deleteGrade] = useMutation<DeleteGradeData>(DELETE_GRADE_SYSTEM);

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //On Delete Handler
    const onDelete = (id: string) => {
        deleteGrade({ deleteGradeId: id }).then(() => {
            refetch({ requestPolicy: "network-only" })
            setNotification(true)
        })
    }

    //On Dialog Close
    const onDialogHandler = () => {
        setDialog(null);
    }

    //Lifecycle Hook
    useEffect(() => {
        refetch({ requestPolicy: "network-only" })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <div className="mb-8">
            {(deleteData.error || deleteData.data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={deleteData.error?.message ? "error" : "success"}
                >
                    {deleteData.error?.message ?? deleteData.data?.deleteGrade.message}
                </Notification>
            }
            <Header
                value={value}
                setValue={setValue}
            />
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Title</th>
                            <th className="bg-primary capitalize text-main font-medium">Grade Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Grade Range</th>
                            <th className="bg-primary capitalize text-main font-medium">Grade Point</th>
                            <th className="bg-primary capitalize text-main font-medium">Created By</th>
                            <th className="bg-primary capitalize text-main font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getGrades.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.grades.map((item, i) => (
                                    <Fragment key={i}>
                                        <span>{item.name}</span><br />
                                    </Fragment>
                                ))}</td>
                                <td>{item.grades.map((item, i) => (
                                    <Fragment key={i}>
                                        <span>{item.percent_from} to {item.percent_upto}</span> <br />
                                    </Fragment>
                                ))}</td>
                                <td>{item.grades.map((item, i) => (
                                    <Fragment key={i}>
                                        <span>{item.grade_point}</span> <br />
                                    </Fragment>
                                ))}</td>
                                <td>{item.createdBy?.name || ("+" + item.createdBy?.phone)}</td>
                                <td>
                                    <div className="flex gap-3">
                                        <div className="tooltip" data-tip="Edit">
                                            <button className="text-blue-600" onClick={() => setDialog(item.id)}>
                                                <Icon icon="material-symbols:edit-document" className="text-xl" />
                                            </button>
                                            <Edit
                                                open={dialog === item.id}
                                                onClose={onDialogHandler}
                                                defaultValue={item}
                                                search={value}
                                            />
                                        </div>
                                        <div className="tooltip" data-tip="Delete">
                                            <button className="text-red-500" onClick={() => onDelete(item.id)} disabled={fetching}>
                                                <Icon icon="ic:round-delete" className="text-xl" />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getGrades.length === 0 && !value &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    No grade system data found!
                                </td>
                            </tr>
                        }
                        {data?.getGrades.length === 0 && value &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    Nothing found &quot;{value}&quot;
                                </td>
                            </tr>
                        }
                        {error &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    {error?.message}
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default Lists;