import { useState } from "react";
import { Dialog, DialogBody, Select, Option, Button } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { Icon } from "@iconify/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import dayjs from "dayjs";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_COMPLAIN, GET_ALL_COMPLAIN } from "@/Urql/Query/Complain/complain.query";
import { UpdateComplainStatus, GetAllComplain, ComplainData } from "@/Urql/Types/Complain/complain.types";


//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: ComplainData;
    refetch: Function;
}

interface Inputs {
    status: string;
}

const Details = ({ open, onClose, defaultValue, refetch }: Props) => {
    //State
    const [notification, setNotification] = useState<boolean>(false);

    //Urql
    const [{ data, error, fetching }, updateStatus] = useMutation<UpdateComplainStatus>(UPDATE_COMPLAIN);
    const [__, refetchAll] = useQuery<GetAllComplain>({ query: GET_ALL_COMPLAIN });

    //Form Initialize
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<Inputs>();

    //Delete Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateStatus({ complainStatusInput: { id: defaultValue.id, status: value.status } }).then(({ data }) => {
            setNotification(true)
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateComplainStatus.success) {
                onClose()
            }
        })
    };

    //Handler-- notification
    const onNotification = () => {
        setNotification(false);
    };

    return (
        <div>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.updateComplainStatus.message}
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
                <DialogBody className="text-textColor">
                    <div className="text-right mb-3">
                        <button className="w-8 h-8 flex items-center justify-center bg-red-50 ml-auto rounded-md" onClick={onClose}>
                            <Icon className="text-red-600 text-xl" icon="ic:round-close" />
                        </button>
                    </div>
                    <h4 className="font-medium text-xl mb-4">{defaultValue.title}</h4>
                    {!defaultValue.anonymous &&
                        <p className="font-medium opacity-50">Complain By: {defaultValue.complainBy.name || defaultValue.complainBy.phone}</p>
                    }
                    <p className="mt-5 text-textColor mb-5">{defaultValue.description}</p>
                    <p className="text-[15px] font-medium opacity-75">Time: {dayjs(defaultValue.created_at).format("DD MMMM YYYY [at] h:mm A")}</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 mt-8">
                        <div className="relative flex-1">
                            <Controller
                                control={control}
                                name="status"
                                rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        label="Select Status"
                                        color="green"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.status ? true : false}
                                    >
                                        <Option value="solve">Save as Solve</Option>
                                        <Option value="rejected">Save as Reject</Option>
                                    </Select>
                                )}
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                {fetching &&
                                    <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                                }
                            </div>
                        </div>
                        <div>
                            <Button type="submit" color="green" className="bg-main py-3 px-10">
                                Save
                            </Button>
                        </div>
                    </form>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default Details;