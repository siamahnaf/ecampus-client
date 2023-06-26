import { useEffect, useState, useContext } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Radio } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler } from "react-hook-form";
import { Icon } from "@iconify/react";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_SUBJECT, GET_SUBJECT_LIST, GET_ALL_SUBJECTS } from "@/Urql/Query/Academics/subject.query";
import { UpdateSubjectData, GetSubjectListData, GetAllSubjectData, SubjectData } from "@/Urql/Types/Academics/subject.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: SubjectData;
}
interface Inputs {
    name: string;
    type: string;
    code: string;
    priority: string;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateSubjectData>(UPDATE_SUBJECT);
    const [_, refetch] = useQuery<GetSubjectListData>({
        query: GET_SUBJECT_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllSubjectData>({ query: GET_ALL_SUBJECTS, pause: true });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>({
        defaultValues: {
            name: defaultValue.name,
            code: defaultValue.code,
            type: defaultValue.type,
            priority: defaultValue.priority
        }
    });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateList({ subjectInput: value, updateSubjectId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateSubject.success) {
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
            code: defaultValue.code,
            type: defaultValue.type,
            priority: defaultValue.priority
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
                    {error?.message ?? data?.updateSubject.message}
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
                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <div className="mb-6">
                                    <Input
                                        variant="standard"
                                        label="Subject"
                                        color="green"
                                        className="!text-base"
                                        error={errors.name ? true : false}
                                        success
                                        {...register("name", { required: true })}
                                    />
                                </div>
                                <div>
                                    <Input
                                        variant="standard"
                                        label="Subject Code"
                                        color="green"
                                        className="!text-base"
                                        error={errors.code ? true : false}
                                        success
                                        {...register("code", { required: true })}
                                    />
                                </div>
                                <div className="flex gap-6 mt-8">
                                    <Radio
                                        id="editedType1"
                                        label="Theory"
                                        color="green"
                                        className="rounded-sm p-0 w-4 h-4"
                                        value="theory"
                                        {...register("type")}
                                        defaultChecked
                                        icon={
                                            <Icon icon="material-symbols:check-box" className="text-xl" />
                                        }
                                        labelProps={{
                                            className: "text-base font-medium opacity-100"
                                        }}
                                    />
                                    <Radio
                                        id="editedType2"
                                        label="Practical"
                                        color="green"
                                        className="rounded-sm p-0 w-4 h-4"
                                        value="practical"
                                        {...register("type")}
                                        icon={
                                            <Icon icon="material-symbols:check-box" className="text-xl" />
                                        }
                                        labelProps={{
                                            className: "text-base font-medium opacity-100"
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-base font-medium ml-3 mb-2">Priority*</h2>
                                <div>
                                    <Radio
                                        id="editedPriority1"
                                        label="Low"
                                        color="green"
                                        className="rounded-sm p-0 w-4 h-4"
                                        value="low"
                                        {...register("priority")}
                                        defaultChecked
                                        icon={
                                            <Icon icon="material-symbols:check-box" className="text-xl" />
                                        }
                                        labelProps={{
                                            className: "text-base font-medium opacity-100"
                                        }}
                                    />
                                </div>
                                <div>
                                    <Radio
                                        id="editedPriority2"
                                        label="Medium"
                                        color="green"
                                        className="rounded-sm p-0 w-4 h-4"
                                        value="medium"
                                        {...register("priority")}
                                        icon={
                                            <Icon icon="material-symbols:check-box" className="text-xl" />
                                        }
                                        labelProps={{
                                            className: "text-base font-medium opacity-100"
                                        }}
                                    />
                                </div>
                                <div>
                                    <Radio
                                        id="editedPriority3"
                                        label="High"
                                        color="green"
                                        className="rounded-sm p-0 w-4 h-4"
                                        value="high"
                                        {...register("priority")}
                                        icon={
                                            <Icon icon="material-symbols:check-box" className="text-xl" />
                                        }
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
                            Save Subject
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;