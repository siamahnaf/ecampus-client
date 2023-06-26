import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";
import Filter, { Inputs } from "./Filter";
import Lists from "./Lists";

//Urql
import { CombinedError, useMutation } from "urql";
import { ADD_ATTENDANCE } from "@/Urql/Query/Attendance/attendance.query";
import { AddAttendanceData } from "@/Urql/Types/Attendance/attendance.types";

const Add = () => {
    //State
    const [notification, setNotification] = useState<boolean>(false);

    //Urql
    const [{ data, error, fetching }, addAttendance] = useMutation<AddAttendanceData>(ADD_ATTENDANCE);

    //Form
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors }
    } = useForm<Inputs>();



    //OnSubmit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const AttendanceData = {
            ...value,
            date: value.date?.endDate
        }
        addAttendance({ attendanceInput: AttendanceData }).catch(err => setNotification(true))
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    return (
        <div className="mb-8">
            {error &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity="error"
                >
                    {error?.message}
                </Notification>
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <Filter
                    register={register}
                    watch={watch}
                    control={control}
                    fetching={fetching}
                    errors={errors}
                />
            </form>
            {data?.createAttendanceSheet &&
                <Lists
                    students={data.createAttendanceSheet}
                    studentError={error as CombinedError}
                />
            }
        </div>
    );
};

export default Add;