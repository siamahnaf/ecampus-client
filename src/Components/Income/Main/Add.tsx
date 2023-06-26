import { useState, useContext, ChangeEvent } from "react";
import { Input, Button, Select, Option, Textarea } from "@material-tailwind/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Datepicker, DateValueType } from "react-custom-datepicker-tailwind";
import { Icon } from "@iconify/react";
import { FileUpload } from "react-export-table";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_INCOME, GET_INCOME_LIST, GET_ALL_INCOME } from "@/Urql/Query/Income/income.query";
import { AddIncomeData, GetIncomeListData, GetAllIncomeData } from "@/Urql/Types/Income/income.types";
import { GET_ALL_INCOME_HEAD } from "@/Urql/Query/Income/head.query";
import { GetAllIncomeHeadData } from "@/Urql/Types/Income/head.types";

//Interface
interface Inputs {
    head: string;
    name: string;
    amount: string;
    invoice: string;
    date: DateValueType;
    file: string;
    description: string;
}

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [file, setFile] = useState<File>();

    //Context
    const { setVariables, variables, setPolicy } = useContext(PaginationContext);

    //Form Initializing
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
        control
    } = useForm<Inputs>();

    //Urql
    const [{ data, error, fetching }, addList] = useMutation<AddIncomeData>(ADD_INCOME);
    const [_, refetch] = useQuery<GetIncomeListData>({
        query: GET_INCOME_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllIncomeData>({ query: GET_ALL_INCOME, pause: true });
    const [headData] = useQuery<GetAllIncomeHeadData>({ query: GET_ALL_INCOME_HEAD })

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Handler
    const onFileHandler = async (file: File) => {
        setFile(file);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "Income" });
        const res = await s3.uploadFile(file);
        console.log(res);
        setValue("file", res.key);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const incomeData = {
            ...value,
            date: value.date?.endDate
        }
        addList({ incomeInput: incomeData }).then(({ data }) => {
            if (data?.addIncome.success) {
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
                    {error?.message ?? data?.addIncome.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Income</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-3 gap-7 items-end">
                    <div>
                        <Controller
                            control={control}
                            name="head"
                            key="head"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (headData?.data && headData.data.getAllIncomeHead.length === 0) return (
                                    <Select
                                        label="Select Head"
                                        color="green"
                                        variant="standard"
                                        key="empty_head"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.head ? true : false}
                                    >
                                        {headData?.data && headData.data.getAllIncomeHead.length === 0 &&
                                            <Option disabled>Please Add Some Head First</Option>
                                        }
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Select Head"
                                        color="green"
                                        variant="standard"
                                        key="not_empty_head"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.head ? true : false}
                                    >
                                        {headData?.data && headData.data.getAllIncomeHead.length > 0 && headData.data?.getAllIncomeHead.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.title}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
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
                        <Input
                            label="Amount"
                            color="green"
                            variant="standard"
                            error={errors.amount ? true : false}
                            {...register("amount", { required: true })}
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field: { onChange, value } }) => (
                                <Datepicker
                                    useRange={false}
                                    asSingle={true}
                                    value={value}
                                    onChange={onChange}
                                    primaryColor="green"
                                    containerClassName={"z-50"}
                                    customInput={
                                        <Input
                                            label="Date"
                                            variant="standard"
                                            color="green"
                                            icon={<Icon icon="uis:calender" />}
                                        />
                                    }
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Input
                            label="Invoice"
                            color="green"
                            variant="standard"
                            {...register("invoice")}
                        />
                    </div>
                    <div>
                        <FileUpload
                            acceptType={[".pdf", ".doc", ".docx", ".xls", "xlsx", "image/*", ".csv"]}
                            onChange={onFileHandler}
                            value={file}
                        >
                            {({
                                onFileUpload,
                                fileInfo
                            }) => (
                                <div className={`flex border border-solid border-main p-2 items-end rounded-md justify-center gap-3 cursor-pointer ${fileInfo && "border-opacity-10 bg-gray-100"}`} onClick={onFileUpload}>
                                    {fileInfo ? (
                                        <>
                                            <Icon className="text-2xl text-main" icon="material-symbols:file-copy" /><p className="font-semibold text-main uppercase">{fileInfo.file.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <Icon className="text-2xl text-main" icon="ic:round-plus" /> <p className="font-semibold text-main uppercase">Upload File</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </FileUpload>
                    </div>
                    <div className="col-span-3">
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
                        Save Income
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;