import { useEffect, useState } from "react";
import { Input, Select, Option, Button } from "@material-tailwind/react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";

///Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { GET_FEES_BY_CLASS } from "@/Urql/Query/Fee/fees.query";
import { GetFeeByClass } from "@/Urql/Types/Fee/fees.types";
import { ADD_WEAVER } from "@/Urql/Query/Weaver/weaver.query";
import { Student, AddWeaverData } from "@/Urql/Types/Weaver/weaver.types";

//Interface
interface Inputs {
    fee: string;
    discount: string;
    discountUnit: string;
    frequency: string;
}
interface Props {
    student: Student;
    refetch: Function;
}


const Add = ({ student, refetch }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Urql
    const [feesData, refetchFee] = useQuery<GetFeeByClass>({ query: GET_FEES_BY_CLASS, variables: { feeByClassInput: { classId: student.class.id, shiftId: student.shift.id, sectionId: student.section.id, groupId: student.group?.id } } });
    const [{ data, error, fetching }, addWeavers] = useMutation<AddWeaverData>(ADD_WEAVER);

    console.log(feesData);

    //Form Initializing
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<Inputs>();

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Handler On Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addWeavers({ weaverInput: { ...value, student: student.id } }).then(() => {
            setNotification(true)
            refetch({ requestPolicy: "network-only" });
        })
    };

    //Lifecycle hook
    useEffect(() => {
        if (student) {
            refetchFee({ requestPolicy: "network-only" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [student])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-dashed border-textColor border-opacity-50 p-5 rounded-md mt-7">
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.addWeaver.message}
                </Notification>
            }
            <div className="grid grid-cols-4 gap-5">
                <div>
                    <Controller
                        control={control}
                        name="fee"
                        key="fee"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => {
                            if (feesData?.data && feesData.data.getFeeByClass.length === 0) return (
                                <Select
                                    label="Select Fee"
                                    color="green"
                                    key="empty_fee"
                                    onChange={(e) => onChange(e as string)}
                                    error={errors.fee ? true : false}
                                >
                                    <Option disabled>Please add some fee first!</Option>
                                </Select>
                            )
                            return (
                                <Select
                                    label="Select Fee"
                                    color="green"
                                    key="not_empty_fee"
                                    value={value}
                                    onChange={(e) => onChange(e as string)}
                                    error={errors.fee ? true : false}
                                >
                                    {feesData.data?.getFeeByClass.map((item, i) => (
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
            <div className="mt-10 flex gap-2 items-center">
                <div className="flex-1">
                    {fetching &&
                        <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                    }
                </div>
                <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                    Save Weaver
                </Button>
            </div>
        </form>
    );
};

export default Add;