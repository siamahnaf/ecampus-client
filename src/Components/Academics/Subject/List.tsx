import { useState, useContext } from "react";
import { Icon } from "@iconify/react";

//Components
import { Notification } from "@/Components/Common/Notification";
import Pagination from "@/Components/Common/Pagination";
import Confirm from "@/Components/Common/Confirm";
import Header from "./Header";
import Edit from "./Edit";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useQuery, useMutation } from "urql";
import { GET_SUBJECT_LIST, GET_ALL_SUBJECTS, DELETE_SUBJECT } from "@/Urql/Query/Academics/subject.query";
import { GetSubjectListData, GetAllSubjectData, DeleteSubjectData } from "@/Urql/Types/Academics/subject.types";

//Interface
export interface Variables {
    search: string;
    limit: number;
    cursor: string;
}

const List = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [confirm, setConfirm] = useState<string | null>(null);
    const [update, setUpdate] = useState<string | null>(null);

    //Context
    const { variables, setVariables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetSubjectListData>({
        query: GET_SUBJECT_LIST,
        variables: { searchInput: variables },
        requestPolicy: policy
    });
    const [deleteData, deleteList] = useMutation<DeleteSubjectData>(DELETE_SUBJECT);
    const [__, refetchAll] = useQuery<GetAllSubjectData>({ query: GET_ALL_SUBJECTS, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //On Delete Confirm
    const onDeleteConfirm = (id: string) => {
        deleteList({ deleteSubjectId: id }).then(() => {
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            setNotification(true)
        })
    }
    return (
        <div className="mb-8">
            {(deleteData.error || deleteData.data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={deleteData.error?.message ? "error" : "success"}
                >
                    {deleteData.error?.message ?? deleteData.data?.deleteSubject.message}
                </Notification>
            }
            <Header />
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Subject Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Subject Code</th>
                            <th className="bg-primary capitalize text-main font-medium">Type</th>
                            <th className="bg-primary capitalize text-main font-medium">Priority</th>
                            <th className="bg-primary capitalize text-main font-medium">Created By</th>
                            <th className="bg-primary capitalize text-main font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getSubjects.results.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.code}</td>
                                <td className="capitalize">{item.type}</td>
                                <td className="capitalize">{item.priority}</td>
                                <td>{item.createdBy?.name || ("+" + item.createdBy?.phone)}</td>
                                <td className="flex gap-3 justify-center">
                                    <div className="tooltip" data-tip="Edit">
                                        <button className="text-blue-600" onClick={() => setUpdate(item.id)}>
                                            <Icon icon="material-symbols:edit-document" className="text-xl" />
                                        </button>
                                        <Edit
                                            open={update === item.id}
                                            onClose={() => setUpdate(null)}
                                            defaultValue={item}
                                        />
                                    </div>
                                    <div className="tooltip" data-tip="Delete">
                                        <button className="text-red-500" onClick={() => setConfirm(item.id)} disabled={fetching}>
                                            <Icon icon="ic:round-delete" className="text-xl" />
                                        </button>
                                        <Confirm
                                            open={confirm === item.id}
                                            onClose={() => setConfirm(null)}
                                            fetching={deleteData.fetching}
                                            id={item.id}
                                            onConfirm={(id) => onDeleteConfirm(id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getSubjects.results.length === 0 && !variables.search &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    No subject data found!
                                </td>
                            </tr>
                        }
                        {data?.getSubjects.results.length === 0 && variables.search &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    Nothing found with &quot;{variables.search}&quot;
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
            <div className="mt-5">
                <Pagination
                    onNextClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getSubjects.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getSubjects.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getSubjects.meta}
                />
            </div>
        </div>
    );
};

export default List;