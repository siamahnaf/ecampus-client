import { useState } from "react";
import { Icon } from "@iconify/react";

///Components
import { Notification } from "@/Components/Common/Notification";
import Edit from "./Edit";

//Urql
import { useMutation } from "urql";
import { DELETE_WEAVER } from "@/Urql/Query/Weaver/weaver.query";
import { Weaver, DeleteWeaverData, Student } from "@/Urql/Types/Weaver/weaver.types";


//Interface 
interface Props {
    weavers: Weaver[];
    refetch: Function;
    student: Student;
}

const Lists = ({ weavers, refetch, student }: Props) => {
    //State
    const [notification, setNotification] = useState<boolean>(false);
    const [dialog, setDialog] = useState<number | null>(null);

    //Urql
    const [{ data, error }, deleteWeaver] = useMutation<DeleteWeaverData>(DELETE_WEAVER);

    //On Delete Handler
    const onWeaverDelete = (id: string) => {
        deleteWeaver({ deleteWeaverId: id }).then(() => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" });
        })
    }

    //On Dialog Close
    const onDialogHandler = () => {
        setDialog(null);
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    return (
        <div>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.deleteWeaver.message}
                </Notification>
            }
            <h4 className="font-semibold mt-8 mb-4 uppercase text-lg">Weaver List</h4>
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Fee Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Discount</th>
                            <th className="bg-primary capitalize text-main font-medium">Discount Unit</th>
                            <th className="bg-primary capitalize text-main font-medium">Frequency</th>
                            <th className="bg-primary capitalize text-main font-medium">Offered By</th>
                            <th className="bg-primary capitalize text-main font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weavers.map((item, i) => (
                            <tr key={i}>
                                <td>{item.fee.name}</td>
                                <td>{item.discount}</td>
                                <td className="capitalize">{item.discountUnit}</td>
                                <td className="capitalize">{item.frequency}</td>
                                <td>{item.createdBy?.name || ("+" + item.createdBy?.phone)}</td>
                                <td className="flex gap-3">
                                    <div className="tooltip" data-tip="Edit">
                                        <button className="text-blue-600" onClick={() => setDialog(i)}>
                                            <Icon icon="material-symbols:edit-document" className="text-xl" />
                                        </button>
                                        <Edit
                                            open={dialog === i}
                                            onClose={onDialogHandler}
                                            defaultValue={item}
                                            student={student}
                                            refetch={refetch}
                                        />
                                    </div>
                                    <div className="tooltip" data-tip="Delete">
                                        <button className="text-red-500" onClick={() => onWeaverDelete(item.id)}>
                                            <Icon icon="ic:round-delete" className="text-xl" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {weavers.length === 0 &&
                            <tr>
                                <td colSpan={6} className="text-center text-main font-medium text-base py-4">
                                    There is not weaver created yet!
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