import { useEffect, useState, useContext } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_GROUP, GET_GROUP_LIST, GET_ALL_GROUP } from "@/Urql/Query/Academics/group.query";
import { UpdateGroupData, GetGroupListData, GetAllGroupData, GroupData } from "@/Urql/Types/Academics/group.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: GroupData
}
interface Inputs {
    name: string;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateGroupData>(UPDATE_GROUP);
    const [_, refetch] = useQuery<GetGroupListData>({
        query: GET_GROUP_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllGroupData>({ query: GET_ALL_GROUP, pause: true });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>({ defaultValues: { name: defaultValue.name } });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateList({ groupInput: value, updateGroupId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateGroup.success) {
                onClose()
            }
        })
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Lifecycle Hook
    useEffect(() => {
        reset({ name: defaultValue.name })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])

    return (
        <div>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.updateGroup.message}
                </Notification>
            }
            <Dialog
                open={open}
                handler={onClose}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: -15 },
                }}
                size="sm"
                style={{ fontFamily: inter.style.fontFamily }}
                className="rounded-lg"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="text-xl">
                        Edit {defaultValue.name}
                    </DialogHeader>
                    <DialogBody className="py-6">
                        <Input
                            label="Group"
                            color="green"
                            variant="standard"
                            error={errors.name ? true : false}
                            success
                            {...register("name", { required: true })}
                        />
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} className="focus:right-0">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Group
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;