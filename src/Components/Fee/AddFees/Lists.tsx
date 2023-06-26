import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

//Components
import { Notification } from "@/Components/Common/Notification";
import Edit from "./Edit";
import Header from "./Header";

//Urql
import { useQuery, useMutation } from "urql";
import { GET_FEES_LIST, DELETE_FEE } from "@/Urql/Query/Fee/fees.query";
import { GetFeesData, DeleteFeesData } from "@/Urql/Types/Fee/fees.types";

const Lists = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [value, setValue] = useState<string>("");
    const [dialog, setDialog] = useState<null | string>(null);

    //Graphql Hook
    const [{ data, error, fetching }, refetch] = useQuery<GetFeesData>({
        query: GET_FEES_LIST,
        variables: { searchInput: { search: value } }
    });
    const [deleteData, deleteFee] = useMutation<DeleteFeesData>(DELETE_FEE);

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //On Delete Handler
    const onSectionDelete = (id: string) => {
        deleteFee({ deleteFeesId: id }).then(() => {
            setNotification(true)
            refetch({ requestPolicy: "network-only" })
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
                    {deleteData.error?.message ?? deleteData.data?.deleteFees.message}
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
                            <th className="bg-primary capitalize text-main font-medium">Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Class</th>
                            <th className="bg-primary capitalize text-main font-medium">Frequency</th>
                            <th className="bg-primary capitalize text-main font-medium">Amount</th>
                            <th className="bg-primary capitalize text-main font-medium">Created By</th>
                            <th className="bg-primary capitalize text-main font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getFees.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.class.name}</td>
                                <td className="capitalize">{item.frequency}</td>
                                <td>{item.amount}</td>
                                <td>{item.createdBy?.name || ("+" + item.createdBy?.phone)}</td>
                                <td className="flex gap-3">
                                    <div className="tooltip" data-tip="Edit">
                                        <button className="text-blue-600" onClick={() => setDialog(item.id)}>
                                            <Icon icon="material-symbols:edit-document" className="text-xl" />
                                        </button>
                                        <Edit
                                            open={item.id === dialog}
                                            onClose={onDialogHandler}
                                            defaultValue={item}
                                            search={value}
                                        />
                                    </div>
                                    <div className="tooltip" data-tip="Delete">
                                        <button className="text-red-500" onClick={() => onSectionDelete(item.id)} disabled={fetching}>
                                            <Icon icon="ic:round-delete" className="text-xl" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getFees.length === 0 && !value &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    No fee data found!
                                </td>
                            </tr>
                        }
                        {data?.getFees.length === 0 && value &&
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
        </div>
    );
};

export default Lists;