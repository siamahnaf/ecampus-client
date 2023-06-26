import { useState, useContext } from "react";
import { Input, Button, Radio } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Icon } from "@iconify/react";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_SUBJECT, GET_SUBJECT_LIST, GET_ALL_SUBJECTS } from "@/Urql/Query/Academics/subject.query";
import { AddSubjectData, GetSubjectListData, GetAllSubjectData } from "@/Urql/Types/Academics/subject.types";

//Interface
interface Inputs {
    name: string;
    type: string;
    code: string;
    priority: string;
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
    const [{ data, error, fetching }, addList] = useMutation<AddSubjectData>(ADD_SUBJECT);
    const [_, refetch] = useQuery<GetSubjectListData>({
        query: GET_SUBJECT_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllSubjectData>({ query: GET_ALL_SUBJECTS, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ subjectInput: value }).then(({ data }) => {
            if (data?.addSubject.success) {
                if (variables.page > 1) {
                    setPolicy?.("network-only")
                    setVariables?.(prev => ({ ...prev, page: 1 }))
                } else {
                    refetch({ requestPolicy: "network-only" })
                }
                refetch({ requestPolicy: "network-only" })
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
                    {error?.message ?? data?.addSubject.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Subject</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
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
                                id="type1"
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
                                id="type2"
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
                                id="priority1"
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
                                id="priority2"
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
                                id="priority3"
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
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Subject
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;