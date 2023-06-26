import { useState, useEffect } from "react";
import { Checkbox, Input, Textarea, Tabs, Tab, TabsHeader, TabsBody, TabPanel, Button } from "@material-tailwind/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import ReactS3Client from "react-s3-typescript";
import { useForm, SubmitHandler } from "react-hook-form";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Context
import { NotificationContext, Inputs } from "@/Context/notification-context";
import { defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";
import ImageUpload from "@/Components/Common/ImageUpload";
import Individual from "./Individual";
import Group from "./Group";
import Classes from "./Classes";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_NOTIFICATION, GET_ALL_NOTIFICATIONS, GET_EXPORT_NOTIFICATION } from "@/Urql/Query/Communication/notification.query";
import { AddNotificationData, GetAllNotifyData, GetExportNotifyData } from "@/Urql/Types/Communication/notification.types";

// Data
const TabsData = [
    { label: "Group", value: "group" },
    { label: "Individual", value: "individual" },
    { label: "Class", value: "class" }
]

const Add = () => {
    //State
    const [images, setImages] = useState<ImageListType>([]);
    const [activeTab, setActiveTab] = useState<string>("group");
    const [notification, setNotification] = useState(false);

    //Urql
    const [{ data, error, fetching }, addNotification] = useMutation<AddNotificationData>(ADD_NOTIFICATION);
    const [_, refetch] = useQuery<GetAllNotifyData>({ query: GET_ALL_NOTIFICATIONS, variables: { searchInput: defaultVariable }, pause: true });
    const [__, refetchAll] = useQuery<GetExportNotifyData>({ query: GET_EXPORT_NOTIFICATION, pause: true });

    //Form Initializing
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
        watch
    } = useForm<Inputs>({ defaultValues: { receivers: [] }, });

    //Handler
    const onIconHandler = async (imageList: ImageListType) => {
        setImages(imageList);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "notifications" });
        const res = await s3.uploadFile(imageList[0]?.file as File);
        setValue("image", res.key);
    };

    //Handler on Tab Chang
    const onSetActiveTab = (value: string) => {
        setActiveTab(value)
        setValue("receivers", []);
    }

    //Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const ApiData = {
            ...value,
            receivers: {
                type: value.receivers[0].type,
                to: value.receivers.map(item => item.id)
            }
        }
        addNotification({ notificationInput: ApiData }).then(({ data }) => {
            setNotification(true)
            if (data?.addNotification.success) {
                refetch({ requestPolicy: "network-only" })
                refetchAll({ requestPolicy: "network-only" })
                reset();
            }
        })
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Lifecycle hook
    useEffect(() => {
        register("receivers", { required: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="my-6">
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.addNotification.message}
                </Notification>
            }
            <div className="mb-4">
                <h6 className="font-bold uppercase text-md">Add Notification</h6>
                <p className="text-sm opacity-50 mt-2">Please check sms box if you want to sent sms also!</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                    <Checkbox
                        label="SMS"
                        color="green"
                        className="w-4 h-4 rounded"
                        labelProps={{ className: "font-medium text-[15px]" }}
                        {...register("sms")}
                    />
                </div>
                <div className="mb-5">
                    <Input
                        label="Title"
                        color="green"
                        error={errors.title ? true : false}
                        {...register("title", { required: true })}
                    />
                </div>
                <div className="mb-4">
                    <Textarea
                        label="Message"
                        rows={5}
                        color="green"
                        error={errors.details ? true : false}
                        {...register("details", { required: true, maxLength: 160 })}
                    />
                </div>
                <div className="mb-5">
                    <ImageUploading
                        value={images}
                        onChange={onIconHandler}
                        dataURLKey="ecampus"
                    >
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemove,
                            isDragging,
                            dragProps,
                        }) => (
                            <ImageUpload
                                imageList={imageList}
                                isDragging={isDragging}
                                dragProps={dragProps}
                                onImageUpload={onImageUpload}
                                image={""}
                                onImageRemove={onImageRemove}
                            />
                        )}
                    </ImageUploading>
                </div>
                <div className={`border border-solid rounded-md ${errors.receivers ? "border-red-600" : "border-blue-gray-100"}`}>
                    <NotificationContext.Provider value={{ register, setValue, watch, errors, getValues }}>
                        <Tabs value={activeTab}>
                            <TabsHeader
                                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                                indicatorProps={{
                                    className: "bg-transparent border-b-2 border-main shadow-none rounded-none",
                                }}
                            >
                                {TabsData.map((item, i) => (
                                    <Tab
                                        key={i}
                                        value={item.value}
                                        onClick={() => onSetActiveTab(item.value)}
                                        className={`py-5 ${i < 2 ? "border-r border-solid border-blue-gray-50" : ""} ${activeTab === item.value ? "text-main" : ""}`}
                                    >
                                        {item.label}
                                    </Tab>
                                ))}
                            </TabsHeader>
                            <TabsBody>
                                <TabPanel value="group" className="text-textColor">
                                    <Group />
                                </TabPanel>
                                <TabPanel value="individual" className="text-textColor">
                                    <Individual />
                                </TabPanel>
                                <TabPanel value="class" className="text-textColor">
                                    <Classes />
                                </TabPanel>
                            </TabsBody>
                        </Tabs>
                    </NotificationContext.Provider>
                </div>
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5 px-5" type="submit" color="green">
                        Send Notification
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Add;