import { useState, ChangeEvent } from "react";
import { Input, Select, Option, Button } from "@material-tailwind/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Datepicker, DateValueType } from "react-custom-datepicker-tailwind";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { FileUpload } from "react-export-table";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Context
import { defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useQuery, useMutation } from "urql";
import { ADD_TEACHER, GET_TEACHER_LIST, GET_ALL_TEACHER } from "@/Urql/Query/Staff/teacher.query";
import { AddTeacherData, GetTeachersData, GetAllTeacher } from "@/Urql/Types/Staff/teacher.types";

//Interface
interface Inputs {
    name: string;
    image: string;
    phone: string;
    email: string;
    dob: DateValueType;
    gender: string;
    nid: string;
    education: string;
    emergencyPhone: string;
    appointment: DateValueType;
    salary: string;
    address: string;
    document: string;
}

const Add = () => {
    //States
    const [images, setImages] = useState<ImageListType>([]);
    const [document, setDocument] = useState<File>();
    const [notification, setNotification] = useState(false);

    //Urql
    const [{ data, error, fetching }, addTeacher] = useMutation<AddTeacherData>(ADD_TEACHER);
    const [_, refetch] = useQuery<GetTeachersData>({
        query: GET_TEACHER_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllTeacher>({ query: GET_ALL_TEACHER, pause: true });

    //Form
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control,
        setValue
    } = useForm<Inputs>({
        defaultValues: {
            phone: "+880 "
        }
    });

    //On Image Change
    const onImageChange = async (imageList: ImageListType) => {
        setImages(imageList);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "teacher" });
        const res = await s3.uploadFile(imageList[0].file as File);
        setValue("image", res.key);
    };

    //On Document Upload
    const onDocumentUpload = async (file: File) => {
        setDocument(file);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "teacher" });
        const res = await s3.uploadFile(file);
        setValue("document", res.key);
    }

    //Form Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const teacherData = {
            ...value,
            dob: value.dob?.startDate,
            appointment: value.appointment?.startDate,
            phone: value.phone.replace(/\+/g, '').replace(/\s+/g, '').replace(/(88)0+(?!1)(\d+)/g, '$1$2').replace(/^0+/, '')
        }
        addTeacher({ teacherInput: teacherData }).then(({ data }) => {
            setNotification(true)
            if (data?.addTeacher.success) {
                reset();
                setDocument(undefined);
                setImages([]);
                refetch({ requestPolicy: "network-only" })
                refetchAll({ requestPolicy: "network-only" })
            }
        })
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    return (
        <div className="pb-5">
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.addTeacher.message}
                </Notification>
            }
            <h3 className="text-base font-semibold mb-5">Add Teacher</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-4">
                    <div className="basis-[20%]">
                        <ImageUploading
                            value={images}
                            onChange={onImageChange}
                            dataURLKey="ecampus"
                        >
                            {({
                                imageList,
                                onImageUpload,
                                isDragging,
                                dragProps,
                            }) => (
                                <div
                                    onClick={onImageUpload}
                                    className="w-36 h-36 cursor-pointer"
                                    {...dragProps}
                                >
                                    {imageList.length === 0 &&
                                        <div className="w-full h-full flex items-center justify-center border border-dashed border-textColor border-opacity-20 rounded-3xl">
                                            { }

                                            {isDragging ? (
                                                <Icon icon="mdi:tick-all" className="text-5xl text-main" />
                                            ) : (
                                                <Icon icon="ic:round-plus" className="text-5xl opacity-25" />
                                            )}
                                        </div>
                                    }
                                    {imageList.length > 0 && imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <Image src={image["ecampus"]} alt="" width={144} height={144} className="w-36 h-36 rounded-3xl" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ImageUploading>
                        <p className="text-sm opacity-60 mt-3">
                            Upload student image from here.
                            Dimension of the image should be{" "}
                            <span className="font-semibold">Passport Size Photo</span>
                        </p>
                    </div>
                    <div className="flex-1 basis-[80%]">
                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <div>
                                <Input
                                    label="Name"
                                    color="green"
                                    error={errors.name ? true : false}
                                    {...register("name", { required: true })}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Phone"
                                    color="green"
                                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                        const formatted = e.target.value.trim()
                                            .replace(/[^0-9+]/g, "")
                                            .replace(/^(\+?88?)?0?/, "+880 ")
                                            .replace(/(\d{6})(?=\d)/g, "$1 ");
                                        e.target.value = formatted
                                    }}
                                    shrink={errors.phone ? false : true}
                                    error={errors.phone ? true : false}
                                    {...register("phone", {
                                        required: true,
                                        minLength: 11
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-8">
                    <div>
                        <Input
                            label="Email"
                            color="green"
                            error={errors.email ? true : false}
                            {...register("email", { required: true })}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="dob"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Datepicker
                                    useRange={false}
                                    asSingle={true}
                                    value={value}
                                    onChange={onChange}
                                    primaryColor="green"
                                    customInput={
                                        <Input
                                            label="Date of Birth"
                                            color="green"
                                            error={errors.dob ? true : false}
                                            icon={<Icon icon="uis:calender" />}
                                        />
                                    }
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="gender"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    label="Gender"
                                    color="green"
                                    value={value}
                                    onChange={onChange}
                                    error={errors.gender ? true : false}
                                >
                                    <Option value="female">Female</Option>
                                    <Option value="male">Male</Option>
                                </Select>
                            )}
                        />
                    </div>
                    <div>
                        <Input
                            label="NID Number"
                            color="green"
                            error={errors.nid ? true : false}
                            {...register("nid", { required: true })}
                        />
                    </div>
                    <div>
                        <Input
                            label="Educational Background"
                            color="green"
                            {...register("education")}
                        />
                    </div>
                    <div>
                        <Input
                            label="Emergency Number"
                            color="green"
                            {...register("emergencyPhone")}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="appointment"
                            rules={{ required: true }}
                            defaultValue={{ startDate: dayjs().format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD") }}
                            render={({ field: { onChange, value } }) => (
                                <Datepicker
                                    useRange={false}
                                    asSingle={true}
                                    value={value}
                                    onChange={onChange}
                                    primaryColor="green"
                                    customInput={
                                        <Input
                                            label="Appointment"
                                            color="green"
                                            error={errors.appointment ? true : false}
                                            icon={<Icon icon="uis:calender" />}
                                        />
                                    }
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Input
                            label="Salary"
                            color="green"
                            error={errors.salary ? true : false}
                            {...register("salary", { required: true })}
                        />
                    </div>
                    <div className="col-span-4">
                        <Input
                            label="Address"
                            color="green"
                            error={errors.address ? true : false}
                            {...register("address", { required: true })}
                        />
                    </div>
                    <div className="col-span-4">
                        <FileUpload
                            acceptType={[".pdf", ".doc", ".docx"]}
                            onChange={onDocumentUpload}
                            value={document}
                        >
                            {({
                                isDragging,
                                dragProps,
                                onFileUpload,
                                errors: fileError,
                                fileInfo
                            }) => (
                                <div>
                                    <div className={`border border-dashed w-full text-center rounded-md py-3 cursor-pointer ${isDragging ? "border-main border-opacity-100" : errors.document ? "border-red-600 border-opacity-100" : "border-textColor border-opacity-60"}`} {...dragProps} onClick={onFileUpload}>
                                        <Icon className={`inline text-5xl ${isDragging ? "text-main opacity-100" : "opacity-25"}`} icon="ic:outline-cloud-upload" />
                                        <p className="mt-2 text-base"><span className="font-bold">Upload an File </span><span className="opacity-40">or drag and drop <br />PDF, WORD</span></p>
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
                <div className="my-8 text-center">
                    <Button
                        color="green"
                        className="bg-main py-2 px-6 relative"
                        type="submit"
                        disabled={fetching}
                    >
                        {fetching ? "Please wait" : "Save Teacher"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Add;