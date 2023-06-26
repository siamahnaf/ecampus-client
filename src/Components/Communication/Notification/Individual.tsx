import { useContext, useState, useEffect } from "react";
import { Input, Button } from "@material-tailwind/react";
import { Icon } from "@iconify/react";

//Context
import { NotificationContext } from "@/Context/notification-context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation } from "urql";
import { SEARCH_USER } from "@/Urql/Query/Communication/notification.query";
import { SearchUserData } from "@/Urql/Types/Communication/notification.types";

const Individual = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [idOrPhone, setIdOrPhone] = useState<string>("");
    const [idError, setIdError] = useState<boolean>(false);

    //Context
    const { setValue, watch, getValues } = useContext(NotificationContext);

    //Watch Form Data
    const formData = watch?.();

    //Urql
    const [{ data, error, fetching }, searchUser] = useMutation<SearchUserData>(SEARCH_USER);

    //On Submit Handler
    const onAddSubmit = () => {
        if (idOrPhone) {
            searchUser({ userSearchInput: { idOrPhone: idOrPhone } }).then(() => {
                setNotification(true)
            })
        } else {
            setIdError(true);
        }
    }

    //Handler on Delete
    const onDeleteHandler = (id: string) => {
        const oldData = getValues?.("receivers");
        const newData = oldData?.filter(item => item.id !== id);
        setValue?.("receivers", newData || [])
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Lifecycle hook
    useEffect(() => {
        if (idOrPhone) {
            setIdError(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idOrPhone])

    useEffect(() => {
        if (data) {
            const oldData = getValues?.("receivers");
            const existingReceiver = oldData?.find((receiver) => receiver.id === data.searchProfile.id);
            const newData = {
                id: data.searchProfile.id,
                name: data.searchProfile.name,
                role: data.searchProfile.role,
                type: "individual"
            }
            if (!existingReceiver) {
                const updatedReceivers = [...oldData || [], newData];
                setValue?.('receivers', updatedReceivers);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    return (
        <div>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? "User Added Successfully!"}
                </Notification>
            }
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Input
                        label="Student Id Or Phone (016....)*" color="green"
                        error={idError ? true : false}
                        onChange={(e) => setIdOrPhone(e.target.value)}
                        value={idOrPhone}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>

                </div>
                <div>
                    <Button color="green" className="bg-main py-3 px-10" disabled={fetching} onClick={onAddSubmit}>
                        Add
                    </Button>
                </div>
            </div>
            <div className="mt-5">
                {formData?.receivers?.map((item, i) => (
                    <div className="flex gap-3 items-center my-3" key={i}>
                        <Icon className="text-xl" icon="material-symbols:person-rounded" />
                        <p className="flex-1 font-medium text-sm">{item.name} (<span className="text-main capitalize">{item.role}</span>)</p>
                        <button onClick={() => onDeleteHandler(item.id)}>
                            <Icon className="text-xl text-red-600" icon="ic:round-delete" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Individual;