import { useState, useContext } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

//Components
import { Notification } from "@/Components/Common/Notification";
import Pagination from "@/Components/Common/Pagination";
import Confirm from "@/Components/Common/Confirm";
import Header from "./Header";
import Edit from "./Edit";
import View from "./View";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useQuery, useMutation } from "urql";
import { GET_NOTICE, GET_ALL_NOTICE, DELETE_NOTICE } from "@/Urql/Query/Notice/notice.query";
import { GetNoticeData, GetAllNoticeData, DeleteNoticeData } from "@/Urql/Types/Notice/notice.types";

const List = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [confirm, setConfirm] = useState<string | null>(null);
    const [update, setUpdate] = useState<string | null>(null);
    const [view, setView] = useState<string | null>(null);

    //Context
    const { variables, setVariables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetNoticeData>({
        query: GET_NOTICE,
        variables: { searchInput: variables },
        requestPolicy: policy
    });
    const [deleteData, deleteList] = useMutation<DeleteNoticeData>(DELETE_NOTICE);
    const [__, refetchAll] = useQuery<GetAllNoticeData>({ query: GET_ALL_NOTICE, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //On Delete Confirm
    const onDeleteConfirm = (id: string) => {
        deleteList({ deleteNoticeId: id }).then(() => {
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
                    {deleteData.error?.message ?? deleteData.data?.deleteNotice.message}
                </Notification>
            }
            <Header />
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Date</th>
                            <th className="bg-primary capitalize text-main font-medium">Subject</th>
                            <th className="bg-primary capitalize text-main font-medium">Created By</th>
                            <th className="bg-primary capitalize text-main font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getNotices.results.map((item, i) => (
                            <tr key={i}>
                                <td>{dayjs(item.created_at).format("DD-MMM-YYYY")}</td>
                                <td>{item.title}</td>
                                <td>{item.createdBy?.name || ("+" + item.createdBy?.phone)}</td>
                                <td className="flex gap-3 justify-center">
                                    <div className="tooltip" data-tip="View">
                                        <button className="text-main" onClick={() => setView(item.id)}>
                                            <Icon icon="ri:eye-fill" className="text-xl" />
                                        </button>
                                        <View
                                            open={item.id === view}
                                            onClose={() => setView(null)}
                                            defaultValue={item}
                                        />
                                    </div>
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
                        {data?.getNotices.results.length === 0 && !variables.search &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    No notice data found!
                                </td>
                            </tr>
                        }
                        {data?.getNotices.results.length === 0 && variables.search &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    Nothing found with &quot;{variables.search}&quot;
                                </td>
                            </tr>
                        }
                        {error &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
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
                        setVariables?.(prev => ({ ...prev, page: data?.getNotices.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getNotices.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getNotices.meta}
                />
            </div>
        </div>
    );
};

export default List;