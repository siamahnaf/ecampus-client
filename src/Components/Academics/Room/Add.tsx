import { useState, useContext, ChangeEvent } from "react";
import { Input, Button } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_ROOM, GET_ROOM_LIST, GET_ALL_ROOM } from "@/Urql/Query/Academics/room.query";
import { AddRoomsData, GetRoomsListData, GetAllRoomData } from "@/Urql/Types/Academics/room.types";

//Interface
interface Inputs {
    room_no: string;
    capacity: number;
}

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { setVariables, variables, setPolicy } = useContext(PaginationContext);

    //Form Initializing
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>();

    //Urql
    const [{ data, error, fetching }, addList] = useMutation<AddRoomsData>(ADD_ROOM);
    const [_, refetch] = useQuery<GetRoomsListData>({
        query: GET_ROOM_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllRoomData>({ query: GET_ALL_ROOM, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ roomInput: { room_no: value.room_no, capacity: Number(value.capacity) } }).then(({ data }) => {
            if (data?.addRoom.success) {
                if (variables.page > 1) {
                    setPolicy?.("network-only")
                    setVariables?.(prev => ({ ...prev, page: 1 }))
                } else {
                    refetch({ requestPolicy: "network-only" })
                }
                refetchAll({ requestPolicy: "network-only" })
                reset()
            }
            setNotification(true);
        })
    }
    return (
        <div className="mt-2">
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.addRoom.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Class Room</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
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
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Room
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;