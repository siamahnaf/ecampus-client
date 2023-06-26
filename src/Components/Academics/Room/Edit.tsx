import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_ROOM, GET_ROOM_LIST, GET_ALL_ROOM } from "@/Urql/Query/Academics/room.query";
import { UpdateRoomsData, GetRoomsListData, GetAllRoomData, RoomsData } from "@/Urql/Types/Academics/room.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: RoomsData
}
interface Inputs {
    room_no: string;
    capacity: number;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateRoomsData>(UPDATE_ROOM);
    const [_, refetch] = useQuery<GetRoomsListData>({
        query: GET_ROOM_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllRoomData>({ query: GET_ALL_ROOM, pause: true });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>({
        defaultValues: {
            room_no: defaultValue.room_no,
            capacity: defaultValue.capacity
        }
    });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const roomData = {
            room_no: value.room_no,
            capacity: Number(value.capacity)
        }
        updateList({ roomInput: roomData, updateRoomId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateRoom.success) {
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
        reset({
            room_no: defaultValue.room_no,
            capacity: defaultValue.capacity
        })
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
                    {error?.message ?? data?.updateRoom.message}
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
                        Edit {defaultValue.room_no}
                    </DialogHeader>
                    <DialogBody className="py-6">
                        <div>
                            <Input
                                variant="standard"
                                label="Room No"
                                color="green"
                                className="!text-base"
                                error={errors.room_no ? true : false}
                                success
                                {...register("room_no", { required: true })}
                            />
                        </div>
                        <div className="mt-10">
                            <Input
                                variant="standard"
                                label="Capacity"
                                color="green"
                                className="!text-base"
                                error={errors.capacity ? true : false}
                                success
                                {...register("capacity", { required: true })}
                                onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                }}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} className="focus:right-0">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Room
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;