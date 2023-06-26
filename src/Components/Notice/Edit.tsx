import { useEffect, useState, useContext } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Textarea } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler } from "react-hook-form";
import { FileUpload } from "react-export-table";
import { Icon } from "@iconify/react";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_NOTICE, GET_NOTICE, GET_ALL_NOTICE } from "@/Urql/Query/Notice/notice.query";
import { UpdateNoticeData, GetNoticeData, GetAllNoticeData, NoticeData } from "@/Urql/Types/Notice/notice.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: NoticeData
}
interface Inputs {
    title: string;
    pdf: string;
    description: string;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);
    const [pdf, setPdf] = useState<File>();

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateNoticeData>(UPDATE_NOTICE);
    const [_, refetch] = useQuery<GetNoticeData>({
        query: GET_NOTICE,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllNoticeData>({ query: GET_ALL_NOTICE, pause: true });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue
    } = useForm<Inputs>({
        defaultValues: {
            title: defaultValue.title,
            pdf: defaultValue.pdf,
            description: defaultValue.description
        }
    });

    //Handler
    const onFileUpload = async (file: File) => {
        setPdf(file);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "notice" });
        const res = await s3.uploadFile(file);
        setValue("pdf", res.key);
    }

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateList({ noticeInput: value, updateNoticeId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateNotice.success) {
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
            pdf: defaultValue.pdf,
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
                    {error?.message ?? data?.updateNotice.message}
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
                        Edit Notice
                    </DialogHeader>
                    <DialogBody className="py-6">
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
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} className="focus:right-0">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Notice
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;