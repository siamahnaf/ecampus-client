import { useState, useContext } from "react";
import { Input, Button, Textarea } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FileUpload } from "react-export-table";
import { Icon } from "@iconify/react";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_NOTICE, GET_NOTICE, GET_ALL_NOTICE } from "@/Urql/Query/Notice/notice.query";
import { AddNoticeData, GetNoticeData, GetAllNoticeData } from "@/Urql/Types/Notice/notice.types";

//Interface
interface Inputs {
    title: string;
    pdf: string;
    description: string;
}

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [pdf, setPdf] = useState<File>();

    //Context
    const { setVariables, variables, setPolicy } = useContext(PaginationContext);

    //Form Initializing
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue
    } = useForm<Inputs>();

    //Urql
    const [{ data, error, fetching }, addList] = useMutation<AddNoticeData>(ADD_NOTICE);
    const [_, refetch] = useQuery<GetNoticeData>({
        query: GET_NOTICE,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllNoticeData>({ query: GET_ALL_NOTICE, pause: true });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Handler
    const onFileUpload = async (file: File) => {
        setPdf(file);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "notice" });
        const res = await s3.uploadFile(file);
        setValue("pdf", res.key);
    }

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ noticeInput: value }).then(({ data }) => {
            if (data?.addNotice.success) {
                if (variables.page > 1) {
                    setPolicy?.("network-only")
                    setVariables?.(prev => ({ ...prev, page: 1 }))
                } else {
                    refetch({ requestPolicy: "network-only" })
                }
                refetchAll({ requestPolicy: "network-only" })
                reset()
                setPdf(undefined);
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
                    {error?.message ?? data?.addNotice.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Notice</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <Input
                            label="Title"
                            color="green"
                            error={errors.title ? true : false}
                            {...register("title", { required: true })}
                        />
                    </div>
                    <div>
                        <Textarea
                            label="Description"
                            color="green"
                            error={errors.description ? true : false}
                            {...register("description", { required: true })}
                            rows={7}
                        />
                    </div>
                    <div>
                        <FileUpload
                            acceptType={[".pdf"]}
                            onChange={onFileUpload}
                            value={pdf}
                        >
                            {({
                                isDragging,
                                dragProps,
                                onFileUpload,
                                errors: fileError,
                                fileInfo
                            }) => (
                                <div>
                                    <div className={`border border-dashed w-full text-center rounded-md py-3 cursor-pointer ${isDragging ? "border-main border-opacity-100" : errors.pdf ? "border-red-600 border-opacity-100" : "border-textColor border-opacity-60"}`} {...dragProps} onClick={onFileUpload}>
                                        <Icon className={`inline text-5xl ${isDragging ? "text-main opacity-100" : "opacity-25"}`} icon="ic:outline-cloud-upload" />
                                        <p className="mt-2 text-base"><span className="font-bold">Upload an File </span><span className="opacity-40">or drag and drop <br />PDF</span></p>
                                    </div>
                                    {fileInfo &&
                                        <p className="mt-1 text-sm"><span className="text-main font-medium">Selected File: </span>{fileInfo.file.name}</p>
                                    }
                                    {fileError &&
                                        <p className="text-red-600 text-base font-medium mt-1">{fileError}</p>
                                    }
                                </div>
                            )}
                        </FileUpload>
                    </div>
                </div>
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Notice
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;