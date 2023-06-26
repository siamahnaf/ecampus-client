import { useState, useContext } from "react";
import { Input, Button, Radio, Checkbox } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TimePicker } from "react-time-picker-typescript";
import "react-time-picker-typescript/dist/style.css";
import { Icon } from "@iconify/react";

//Fonts
import { inter } from "@/Fonts";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_PERIOD, GET_PERIOD_LIST, GET_ALL_PERIOD } from "@/Urql/Query/Academics/period.query";
import { AddPeriodData, GetPeriodListData, GetAllPeriod } from "@/Urql/Types/Academics/period.types";
import { GET_ALL_SHIFT } from "@/Urql/Query/Academics/shift.query";
import { GetAllShiftData } from "@/Urql/Types/Academics/shift.types";

//Interface
interface Inputs {
    name: string;
    is_break: boolean;
    shift: string;
}

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [start, setStart] = useState("04:00 PM");
    const [end, setEnd] = useState("04:30 PM");

    //Context
    const { setVariables, variables, setPolicy } = useContext(PaginationContext);

    //Form Initializing
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>();

    //Timer Handler
    const onStartChange = (newValue: string | null) => {
        setStart(newValue as string)
    }
    const onEndChange = (newValue: string | null) => {
        setEnd(newValue as string)
    }

    //Urql
    const [{ data, error, fetching }, addList] = useMutation<AddPeriodData>(ADD_PERIOD);
    const [_, refetch] = useQuery<GetPeriodListData>({
        query: GET_PERIOD_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllPeriod>({ query: GET_ALL_PERIOD, pause: true });
    const [shiftData] = useQuery<GetAllShiftData>({ query: GET_ALL_SHIFT });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const periodData = {
            ...value,
            start,
            end,
        }
        addList({ periodInput: periodData }).then(({ data }) => {
            if (data?.addPeriod.success) {
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
                    {error?.message ?? data?.addPeriod.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Period</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <div>
                            <Input
                                label="Period Name"
                                color="green"
                                variant="standard"
                                error={errors.name ? true : false}
                                {...register("name", { required: true })}
                            />
                        </div>
                        <div className="mt-10 flex gap-3 w-full">
                            <div>
                                <TimePicker
                                    onChange={onStartChange}
                                    value={start}
                                    style={{
                                        fontFamily: inter.style.fontFamily
                                    }}
                                    customInput={
                                        <Input
                                            label="Start"
                                            color="green"
                                            className="cursor-pointer"
                                            containerProps={{
                                                className: "min-w-min"
                                            }}
                                            icon={<Icon className="cursor-pointer" icon="ic:round-access-time-filled" />}
                                        />
                                    }
                                    use12Hours
                                />
                            </div>
                            <div>
                                <TimePicker
                                    onChange={onEndChange}
                                    value={end}
                                    style={{
                                        fontFamily: inter.style.fontFamily
                                    }}
                                    customInput={
                                        <Input
                                            label="End"
                                            color="green"
                                            className="cursor-pointer"
                                            containerProps={{
                                                className: "min-w-min"
                                            }}
                                            icon={<Icon className="cursor-pointer" icon="ic:round-access-time-filled" />}
                                        />
                                    }
                                    use12Hours
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className={`text-base font-medium ml-3 mb-2 ${errors.shift && "text-red-600"}`}>Shift*</h2>
                        <div>
                            {shiftData.data?.getAllShifts.map((item, i) => (
                                <div key={i}>
                                    <Radio
                                        id={item.id}
                                        label={item.name}
                                        color="green"
                                        className="rounded-sm p-0 w-4 h-4"
                                        value={item.id}
                                        {...register("shift", { required: true })}
                                        icon={
                                            <Icon icon="material-symbols:check-box" className="text-xl" />
                                        }
                                        labelProps={{
                                            className: "text-base font-medium opacity-100"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-base font-medium ml-3 mb-2">Break</h2>
                        <div>
                            <Checkbox
                                label="Is Break"
                                id="break"
                                color="green"
                                className="w-4 h-4 rounded-sm"
                                {...register("is_break")}
                                labelProps={{
                                    className: "text-base font-medium opacity-100"
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Period
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;