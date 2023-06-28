import { useEffect, useState } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Select, Option } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_WEAVER } from "@/Urql/Query/Weaver/weaver.query";
import { UpdateWeaverData, Weaver, Student } from "@/Urql/Types/Weaver/weaver.types";
import { GET_FEES_BY_CLASS } from "@/Urql/Query/Fee/fees.query";
import { GetFeeByClass } from "@/Urql/Types/Fee/fees.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: Weaver;
    student: Student;
    refetch: Function
}

interface Inputs {
    fee: string;
    discount: string;
    discountUnit: string;
    frequency: string;
}

const Edit = ({ open, onClose, defaultValue, student, refetch }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Urql
    const [feesData, refetchFee] = useQuery<GetFeeByClass>({ query: GET_FEES_BY_CLASS, variables: { classId: student.class.id } });
    const [{ data, error, fetching }, updateClass] = useMutation<UpdateWeaverData>(UPDATE_WEAVER);

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control
    } = useForm<Inputs>({
        defaultValues: {
            fee: defaultValue.fee?.id,
            discount: defaultValue.discount,
            discountUnit: defaultValue.discountUnit,
            frequency: defaultValue.frequency
        }
    });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateClass({ weaverInput: { ...value, student: student.id }, updateWeaverId: defaultValue.id }).then(({ data }) => {
            setNotification(true)
            if (data?.updateWeaver.success) {
                refetch({ requestPolicy: "network-only" })
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
            fee: defaultValue.fee?.id,
            discount: defaultValue.discount,
            discountUnit: defaultValue.discountUnit,
            frequency: defaultValue.frequency
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])

    //Lifecycle hook
    useEffect(() => {
        if (student) {
            refetchFee({ requestPolicy: "network-only" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [student])

    return (
        <div>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.updateWeaver.message}
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
                        Edit {defaultValue.fee?.name}
                    </DialogHeader>
                    <DialogBody className="py-6">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                {feesData.data && feesData.data?.getFeeByClass.length > 0 ?
                                    <Controller
                                        control={control}
                                        name="fee"
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                label="Select Fee"
                                                color="green"
                                                value={value}
                                                onChange={(e) => onChange(e as string)}
                                                error={errors.discountUnit ? true : false}
                                            >
                                                {feesData.data?.getFeeByClass.map((item, i) => (
                                                    <Option key={i} value={item.id}>{item.name}</Option>
                                                ))}
                                            </Select>
                                        )}
                                    /> : <p className="text-red-600 font-semibold">Add Some fees first</p>
                                }
                            </div>
                            <div>
                                <Input
                                    label="Discount"
                                    color="green"
                                    error={errors.discount ? true : false}
                                    {...register("discount", { required: true })}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="discountUnit"
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            label="Discount Unit"
                                            color="green"
                                            value={value}
                                            onChange={(e) => onChange(e as string)}
                                            error={errors.discountUnit ? true : false}
                                        >
                                            <Option value="flat">Flat</Option>
                                            <Option value="percent">Percent</Option>
                                        </Select>
                                    )}
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
                                            onChange={(e) => onChange(e as string)}
                                            error={errors.frequency ? true : false}
                                        >
                                            <Option value="once">Once</Option>
                                            <Option value="always">Always</Option>
                                        </Select>
                                    )}
                                />
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
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>Save Weaver</Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;