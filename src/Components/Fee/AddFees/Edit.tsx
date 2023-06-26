import { useEffect, useState, ChangeEvent } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Select, Option } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_FEE, GET_FEES_LIST } from "@/Urql/Query/Fee/fees.query";
import { UpdateFeeData, GetFeesData, FeesData } from "@/Urql/Types/Fee/fees.types";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: FeesData;
    search: string;
}
interface Inputs {
    name: string;
    class: string;
    shift: string;
    section: string;
    group: string;
    frequency: string;
    amount: string;
    late_fee: string;
    payed_in: string;
}

const Edit = ({ open, onClose, defaultValue, search }: Props) => {
    //State
    const [notification, setNotification] = useState(false);
    const [shift, setShift] = useState<{ id: string, name: string }[] | undefined>();
    const [section, setSection] = useState<{ id: string, name: string }[] | undefined>();
    const [group, setGroup] = useState<{ id: string, name: string }[] | undefined>();

    //Urql
    const [{ data, error, fetching }, updateFee] = useMutation<UpdateFeeData>(UPDATE_FEE);
    const [_, refetch] = useQuery<GetFeesData>({
        query: GET_FEES_LIST,
        variables: { searchInput: { search: search } },
        pause: true
    });
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control,
        watch
    } = useForm<Inputs>({
        defaultValues: {
            name: defaultValue.name,
            class: defaultValue.class.id,
            shift: defaultValue.shift.id,
            section: defaultValue.section.id,
            group: defaultValue.group.id,
            frequency: defaultValue.frequency,
            amount: defaultValue.amount,
            late_fee: defaultValue?.late_fee,
            payed_in: defaultValue?.payed_in
        }
    });

    //Form Data
    const formData = watch().class;

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateFee({ updateFeesId: defaultValue.id, feeInput: value }).then(({ data }) => {
            setNotification(true)
            if (data?.updateFees.success) {
                onClose()
                refetch({ requestPolicy: "network-only" })
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
            class: defaultValue.class.id,
            shift: defaultValue.shift.id,
            section: defaultValue.section.id,
            group: defaultValue.group.id,
            frequency: defaultValue.frequency,
            amount: defaultValue.amount,
            late_fee: defaultValue?.late_fee,
            payed_in: defaultValue?.payed_in
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])

    useEffect(() => {
        if (formData) {
            const currentClass = classData.data?.getAllClass.find(item => item.id === formData)
            setShift(currentClass?.shift)
            setSection(currentClass?.section);
            setGroup(currentClass?.group);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData])

    return (
        <div>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.updateFees.message}
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
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <Input
                                    label="Name"
                                    color="green"
                                    variant="standard"
                                    error={errors.name ? true : false}
                                    {...register("name", { required: true })}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="class"
                                    key="class"
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => {
                                        if (classData?.data && classData.data.getAllClass.length === 0) return (
                                            <Select
                                                label="Class"
                                                color="green"
                                                key="empty_class"
                                                variant="standard"
                                                onChange={(e) => onChange(e as string)}
                                                error={errors.class ? true : false}
                                            >
                                                <Option disabled>Please Add Some Class First</Option>
                                            </Select>
                                        )
                                        return (
                                            <Select
                                                label="Class"
                                                color="green"
                                                key="not_empty_class"
                                                variant="standard"
                                                value={value}
                                                onChange={(e) => onChange(e as string)}
                                                error={errors.class ? true : false}
                                            >
                                                {classData.data?.getAllClass.map((item, i) => (
                                                    <Option key={i} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )
                                    }}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="shift"
                                    key="shift"
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => {
                                        if (!shift || shift.length === 0) return (
                                            <Select
                                                label="Shift"
                                                color="green"
                                                key="empty_shift"
                                                variant="standard"
                                                onChange={(e) => onChange(e as string)}
                                                error={errors.shift ? true : false}
                                            >
                                                <Option disabled>{shift === undefined ? "Please select a class!" : "Not shift found!"}</Option>
                                            </Select>
                                        )
                                        return (
                                            <Select
                                                label="Shift"
                                                color="green"
                                                variant="standard"
                                                key="not_empty_shift"
                                                value={value}
                                                onChange={(e) => onChange(e as string)}
                                                error={errors.shift ? true : false}
                                            >
                                                {shift.map((item, i) => (
                                                    <Option key={i} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )
                                    }}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="section"
                                    key="section"
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => {
                                        if (!section || section.length === 0) return (
                                            <Select
                                                label="Section"
                                                color="green"
                                                key="empty_section"
                                                variant="standard"
                                                onChange={(e) => onChange(e as string)}
                                                error={errors.section ? true : false}

                                            >
                                                <Option disabled>{group === undefined ? "Please select a class" : "No section found!"}</Option>
                                            </Select>
                                        )
                                        return (
                                            <Select
                                                label="Section"
                                                color="green"
                                                key="not_empty_section"
                                                variant="standard"
                                                value={value}
                                                onChange={(e) => onChange(e as string)}
                                                error={errors.section ? true : false}
                                            >
                                                {section.map((item, i) => (
                                                    <Option key={i} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )
                                    }}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="group"
                                    key="group"
                                    render={({ field: { onChange, value } }) => {
                                        if (!group || group.length === 0) return (
                                            <Select
                                                label="Group"
                                                color="green"
                                                key="empty_group"
                                                variant="standard"
                                                onChange={(e) => onChange(e as string)}
                                            >
                                                <Option disabled>{group === undefined ? "Please select a class" : "No group found!"}</Option>
                                            </Select>
                                        )
                                        return (
                                            <Select
                                                label="Group"
                                                color="green"
                                                key="not_empty_group"
                                                variant="standard"
                                                value={value}
                                                onChange={(e) => onChange(e as string)}
                                            >
                                                {group.map((item, i) => (
                                                    <Option key={i} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )
                                    }}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="frequency"
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            label="Frequency"
                                            color="green"
                                            value={value}
                                            variant="standard"
                                            onChange={(e) => onChange(e as string)}
                                            error={errors.frequency ? true : false}
                                        >
                                            <Option value="once">Once</Option>
                                            <Option value="monthly">Monthly</Option>
                                            <Option value="quarterly">Quarterly</Option>
                                            <Option value="half-yearly">Half-yearly</Option>
                                            <Option value="yearly">Yearly</Option>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Amount"
                                    color="green"
                                    variant="standard"
                                    error={errors.frequency ? true : false}
                                    {...register("amount", { required: true })}
                                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                    }}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Late Fee"
                                    color="green"
                                    variant="standard"
                                    {...register("late_fee")}
                                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                    }}
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    label="Payed In"
                                    color="green"
                                    variant="standard"
                                    {...register("payed_in")}
                                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                    }}
                                />
                                <p className="pointer-events-none cursor-text absolute top-1/2 -translate-y-[25%] right-3 text-sm font-medium">Days</p>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose}>Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>Save Fees</Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;