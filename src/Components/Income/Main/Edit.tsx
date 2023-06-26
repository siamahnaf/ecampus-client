import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Select, Option, Textarea } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Datepicker, DateValueType } from "react-custom-datepicker-tailwind";
import { Icon } from "@iconify/react";
import { FileUpload } from "react-export-table";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_INCOME, GET_INCOME_LIST, GET_ALL_INCOME } from "@/Urql/Query/Income/income.query";
import { UpdateIncomeData, GetIncomeListData, GetAllIncomeData, IncomeData } from "@/Urql/Types/Income/income.types";
import { GET_ALL_INCOME_HEAD } from "@/Urql/Query/Income/head.query";
import { GetAllIncomeHeadData } from "@/Urql/Types/Income/head.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: IncomeData
}
interface Inputs {
    head: string;
    name: string;
    amount: string;
    invoice: string;
    date: DateValueType;
    file: string;
    description: string;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);
    const [file, setFile] = useState<File>();

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateIncomeData>(UPDATE_INCOME);
    const [_, refetch] = useQuery<GetIncomeListData>({
        query: GET_INCOME_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllIncomeData>({ query: GET_ALL_INCOME, pause: true });
    const [headData] = useQuery<GetAllIncomeHeadData>({ query: GET_ALL_INCOME_HEAD });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
        control
    } = useForm<Inputs>({
        defaultValues: {
            head: defaultValue.head.id,
            name: defaultValue.name,
            amount: defaultValue.amount,
            invoice: defaultValue.invoice,
            date: { endDate: defaultValue.date, startDate: defaultValue.date },
            file: defaultValue.file,
            description: defaultValue.description
        }
    });

    //Handler
    const onFileHandler = async (file: File) => {
        setFile(file);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "Income" });
        const res = await s3.uploadFile(file);
        console.log(res);
        setValue("file", res.key);
    };

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const incomeData = {
            ...value,
            date: value.date?.endDate
        }
        updateList({ incomeInput: incomeData, updateIncomeId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateIncome.success) {
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
            head: defaultValue.head.id,
            name: defaultValue.name,
            amount: defaultValue.amount,
            invoice: defaultValue.invoice,
            date: { endDate: defaultValue.date, startDate: defaultValue.date },
            file: defaultValue.file,
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
                    {error?.message ?? data?.updateIncome.message}
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
                        <div className="grid grid-cols-3 gap-7 items-end">
                            <div>
                                <Controller
                                    control={control}
                                    name="head"
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => {
                                        if (headData?.data && headData.data.getAllIncomeHead.length === 0) return (
                                            <Select
                                                label="Select Head"
                                                color="green"
                                                variant="standard"
                                                value={value}
                                                onChange={onChange}
                                                error={errors.head ? true : false}
                                            >
                                                <Option disabled>Please Add Some Head First</Option>
                                            </Select>
                                        )
                                        return (
                                            <Select
                                                label="Select Head"
                                                color="green"
                                                variant="standard"
                                                value={value}
                                                onChange={onChange}
                                                error={errors.head ? true : false}
                                            >
                                                {headData.data?.getAllIncomeHead.map((item, i) => (
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
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} className="focus:right-0">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Expense
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;