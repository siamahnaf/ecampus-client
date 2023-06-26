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
import { GET_EXPENSE_LIST, GET_ALL_EXPENSE, DELETE_EXPENSE } from "@/Urql/Query/Expense/expense.query";
import { GetExpenseListData, GetAllExpense, DeleteExpenseData } from "@/Urql/Types/Expense/expense.types";

const List = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [confirm, setConfirm] = useState<string | null>(null);
    const [update, setUpdate] = useState<string | null>(null);

    //Context
    const { variables, setVariables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetExpenseListData>({
        query: GET_EXPENSE_LIST,
        variables: { searchInput: variables },
        requestPolicy: policy
    });
    const [deleteData, deleteList] = useMutation<DeleteExpenseData>(DELETE_EXPENSE);
    const [__, refetchAll] = useQuery<GetAllExpense>({ query: GET_ALL_EXPENSE, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //On Delete Confirm
    const onDeleteConfirm = (id: string) => {
        deleteList({ deleteExpenseId: id }).then(() => {
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
                    {deleteData.error?.message ?? deleteData.data?.deleteExpense.message}
                </Notification>
            }
            <Header />
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Invoice</th>
                            <th className="bg-primary capitalize text-main font-medium">Date</th>
                            <th className="bg-primary capitalize text-main font-medium">Income Head</th>
                            <th className="bg-primary capitalize text-main font-medium">Amount</th>
                            <th className="bg-primary capitalize text-main font-medium">Created By</th>
                            <th className="bg-primary capitalize text-main font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getExpenses.results.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.invoice}</td>
                                <td>{item.date}</td>
                                <td>{item.head.title}</td>
                                <td>{item.amount}</td>
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
                        {data?.getExpenses.results.length === 0 && !variables.search &&
                            <tr>
                                <td colSpan={7} className="text-center text-main font-medium text-base py-4">
                                    No expense data found!
                                </td>
                            </tr>
                        }
                        {data?.getExpenses.results.length === 0 && variables.search &&
                            <tr>
                                <td colSpan={7} className="text-center text-main font-medium text-base py-4">
                                    Nothing found with &quot;{variables.search}&quot;
                                </td>
                            </tr>
                        }
                        {error &&
                            <tr>
                                <td colSpan={7} className="text-center text-main font-medium text-base py-4">
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
                        setVariables?.(prev => ({ ...prev, page: data?.getExpenses.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getExpenses.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getExpenses.meta}
                />
            </div>
        </div>
    );
};

export default List;