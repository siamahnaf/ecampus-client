import { useState, useContext } from "react";
import { Input, Button, Textarea } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_INCOME_HEAD, GET_INCOME_HEAD_LIST, GET_ALL_INCOME_HEAD } from "@/Urql/Query/Income/head.query";
import { AddIncomeHead, GetAllIncomeHeadData, GetIncomeHeadData } from "@/Urql/Types/Income/head.types";

//Interface
interface Inputs {
    title: string;
    description: string;
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
    const [{ data, error, fetching }, addList] = useMutation<AddIncomeHead>(ADD_INCOME_HEAD);
    const [_, refetch] = useQuery<GetIncomeHeadData>({
        query: GET_INCOME_HEAD_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllIncomeHeadData>({ query: GET_ALL_INCOME_HEAD, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ incomeHeadInput: value }).then(({ data }) => {
            if (data?.addIncomeHead.success) {
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
                    {error?.message ?? data?.addIncomeHead.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Income Head</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
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
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Income Head
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;