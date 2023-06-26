import { useState, useContext } from "react";
import { Input, Button } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_SHIFT, GET_ALL_SHIFT, GET_SHIFT_LIST } from "@/Urql/Query/Academics/shift.query";
import { AddShiftData, GetAllShiftData, GetShiftListData } from "@/Urql/Types/Academics/shift.types";

//Interface
interface Inputs {
    name: string;
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
    const [{ data, error, fetching }, addList] = useMutation<AddShiftData>(ADD_SHIFT);
    const [_, refetch] = useQuery<GetShiftListData>({
        query: GET_SHIFT_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllShiftData>({ query: GET_ALL_SHIFT, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ shiftInput: value }).then(({ data }) => {
            if (data?.addShift.success) {
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
                    {error?.message ?? data?.addShift.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Group</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <Input
                    variant="standard"
                    label="Shift"
                    color="green"
                    className="!text-base"
                    error={errors.name ? true : false}
                    success
                    {...register("name", { required: true, pattern: /\S+/ })}
                />
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Shift
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;