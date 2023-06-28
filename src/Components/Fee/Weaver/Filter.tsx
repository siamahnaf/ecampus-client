import { useState, useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";
import Profile from "./Profile";
import Add from "./Add";
import Lists from "./Lists";

//Urql
import { useQuery } from "urql";
import { GET_WEAVERS } from "@/Urql/Query/Weaver/weaver.query";
import { GetWeaverData } from "@/Urql/Types/Weaver/weaver.types";


//Interface
interface Inputs {
    studentId: string;
}

const Filter = () => {
    //State
    const [notification, setNotification] = useState(false);

    //Form Initializing
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch
    } = useForm<Inputs>();

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetWeaverData>({ query: GET_WEAVERS, variables: { getWeaversId: watch("studentId") }, pause: true });

    //Submit
    const onSubmit: SubmitHandler<Inputs> = () => {
        refetch({ requestPolicy: "network-only" });
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Lifecycle Hook
    useEffect(() => {
        if (error) {
            setNotification(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return (
        <div className="mt-2">
            {error &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity="error"
                >
                    {error?.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Search Student</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <Input
                    variant="standard"
                    label="Student ID"
                    color="green"
                    className="!text-base"
                    error={errors.studentId ? true : false}
                    success
                    {...register("studentId", { required: true })}
                />
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Search Student
                    </Button>
                </div>
            </form>
            {data &&
                <div className="my-8">
                    <h4 className="font-semibold mt-8 mb-4 uppercase text-lg">Search Result</h4>
                    <Profile student={data.getWeavers.student} />
                    <Add student={data.getWeavers.student} refetch={refetch} />
                    <Lists weavers={data.getWeavers.weavers} refetch={refetch} student={data.getWeavers.student} />
                </div>
            }
        </div>
    );
};

export default Filter;