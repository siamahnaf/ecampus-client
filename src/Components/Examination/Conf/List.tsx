import { useState, useContext, Fragment } from "react";
import { Icon } from "@iconify/react";

//Components
import { Notification } from "@/Components/Common/Notification";
import Pagination from "@/Components/Common/Pagination";
import Confirm from "@/Components/Common/Confirm";
import Header from "./Header";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useQuery, useMutation } from "urql";
import { GET_CONF_LIST, GET_ALL_CONFS, DELETE_CONF } from "@/Urql/Query/Examination/conf.query";
import { GetConfData, GetAllConfData, DeleteConfData } from "@/Urql/Types/Examination/conf.types";

const List = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [confirm, setConfirm] = useState<string | null>(null);

    //Context
    const { variables, setVariables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetConfData>({
        query: GET_CONF_LIST,
        variables: { searchInput: variables },
        requestPolicy: policy
    });
    const [deleteData, deleteList] = useMutation<DeleteConfData>(DELETE_CONF);
    const [__, refetchAll] = useQuery<GetAllConfData>({ query: GET_ALL_CONFS, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //On Delete Confirm
    const onDeleteConfirm = (id: string) => {
        deleteList({ deleteConfId: id }).then(() => {
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
                    {deleteData.error?.message ?? deleteData.data?.deleteConf.message}
                </Notification>
            }
            <Header />
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Class</th>
                            <th className="bg-primary capitalize text-main font-medium">Exam Names</th>
                            <th className="bg-primary capitalize text-main font-medium">Subjects</th>
                            <th className="bg-primary capitalize text-main font-medium">Created By</th>
                            <th className="bg-primary capitalize text-main font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getConfs.results.map((item, i) => (
                            <tr key={i}>
                                <td>{item.classId.name}</td>
                                <td>{item.examId.map((item, i) => (
                                    <Fragment key={i}>
                                        <span>{item.name}</span><br />
                                    </Fragment>
                                ))}</td>
                                <td>{item.subjects.map((item, i) => (
                                    <Fragment key={i}>
                                        <span>{item.subjectId.name}({item.totalMarks})</span><br />
                                    </Fragment>
                                ))}</td>
                                <td>{item.createdBy?.name || ("+" + item.createdBy?.phone)}</td>
                                <td>
                                    <div className="flex gap-3 justify-center items-center">
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
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getConfs.results.length === 0 && !variables.search &&
                            <tr>
                                <td colSpan={5} className="text-center text-main font-medium text-base py-4">
                                    No configuration data found!
                                </td>
                            </tr>
                        }
                        {data?.getConfs.results.length === 0 && variables.search &&
                            <tr>
                                <td colSpan={5} className="text-center text-main font-medium text-base py-4">
                                    Nothing found with &quot;{variables.search}&quot;
                                </td>
                            </tr>
                        }
                        {error &&
                            <tr>
                                <td colSpan={5} className="text-center text-main font-medium text-base py-4">
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
                        setVariables?.(prev => ({ ...prev, page: data?.getConfs.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getConfs.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getConfs.meta}
                />
            </div>
        </div>
    );
};

export default List;