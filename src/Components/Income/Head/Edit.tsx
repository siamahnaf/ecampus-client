import { useEffect, useState, useContext } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Textarea } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_INCOME_HEAD, GET_INCOME_HEAD_LIST, GET_ALL_INCOME_HEAD } from "@/Urql/Query/Income/head.query";
import { UpdateIncomeHeadData, GetIncomeHeadData, GetAllIncomeHeadData, IncomeHeadData } from "@/Urql/Types/Income/head.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: IncomeHeadData;
}
interface Inputs {
    title: string;
    description: string;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateIncomeHeadData>(UPDATE_INCOME_HEAD);
    const [_, refetch] = useQuery<GetIncomeHeadData>({
        query: GET_INCOME_HEAD_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllIncomeHeadData>({ query: GET_ALL_INCOME_HEAD, pause: true });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>({
        defaultValues: {
            title: defaultValue.title,
            description: defaultValue.description
        }
    });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateList({ incomeHeadInput: value, updateIncomeHeadId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateIncomeHead.success) {
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
            title: defaultValue.title,
            description: defaultValue.description
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
                    {error?.message ?? data?.updateIncomeHead.message}
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
                        Edit {defaultValue.title}
                    </DialogHeader>
                    <DialogBody className="py-6">
                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <Input
                                    label="Title"
                                    color="green"
                                    variant="standard"
                                    error={errors.title ? true : false}
                                    {...register("title", { required: true })}
                                />
                            </div>
                            <div>
                                <Textarea
                                    label="Description"
                                    color="green"
                                    variant="standard"
                                    {...register("description")}
                                    rows={3}
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
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Income Head
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;