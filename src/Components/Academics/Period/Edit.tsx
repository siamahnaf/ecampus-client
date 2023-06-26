import { useEffect, useState, useContext } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Radio, Checkbox } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler } from "react-hook-form";
import { Icon } from "@iconify/react";
import { TimePicker } from "react-time-picker-typescript";
import "react-time-picker-typescript/dist/style.css";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_PERIOD, GET_PERIOD_LIST, GET_ALL_PERIOD } from "@/Urql/Query/Academics/period.query";
import { UpdatePeriodData, GetPeriodListData, GetAllPeriod, PeriodData } from "@/Urql/Types/Academics/period.types";
import { GET_ALL_SHIFT } from "@/Urql/Query/Academics/shift.query";
import { GetAllShiftData } from "@/Urql/Types/Academics/shift.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: PeriodData;
}
interface Inputs {
    name: string;
    is_break: boolean;
    shift: string;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);
    const [start, setStart] = useState(defaultValue.start);
    const [end, setEnd] = useState(defaultValue.end);

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdatePeriodData>(UPDATE_PERIOD);
    const [_, refetch] = useQuery<GetPeriodListData>({
        query: GET_PERIOD_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [shiftData] = useQuery<GetAllShiftData>({ query: GET_ALL_SHIFT });
    const [__, refetchAll] = useQuery<GetAllPeriod>({ query: GET_ALL_PERIOD, pause: true });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>({
        defaultValues: {
            name: defaultValue.name,
            is_break: defaultValue.is_break,
            shift: defaultValue.shift.id
        }
    });

    //Timer Handler
    const onStartChange = (newValue: string | null) => {
        setStart(newValue as string)
    }
    const onEndChange = (newValue: string | null) => {
        setEnd(newValue as string)
    }

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const periodData = {
            ...value,
            start,
            end,
        }
        updateList({ periodInput: periodData, updatePeriodId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updatePeriod.success) {
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
            name: defaultValue.name,
            is_break: defaultValue.is_break,
            shift: defaultValue.shift.id
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
                    {error?.message ?? data?.updatePeriod.message}
                </Notification>
            }
            <Dialog
                open={open}
                handler={onClose}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: -15 },
                }}
                size="lg"
                style={{ fontFamily: inter.style.fontFamily }}
                className="rounded-lg"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="text-xl">
                        Edit {defaultValue.name}
                    </DialogHeader>
                    <DialogBody className="py-6">
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
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} className="focus:right-0">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Period
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;