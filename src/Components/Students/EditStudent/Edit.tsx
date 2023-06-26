import { useState, ChangeEvent, useEffect } from "react";
import { Input, Select, Option, Button } from "@material-tailwind/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Datepicker, DateValueType } from "react-custom-datepicker-tailwind";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import dayjs from "dayjs";
import ReactS3Client from "react-s3-typescript";
import { useRouter } from "next/router";


//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Context
import { defaultVariable } from "@/Context/student-pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Graphql
import { useQuery, useMutation } from "urql";
import { UPDATE_STUDENT, GET_SINGLE_STUDENT, GET_STUDENT_LIST, GET_ALL_STUDENT } from "@/Urql/Query/Students/student.query";
import { UpdateStudentData, GetSingleStudentData, GetStudentListData, GetAllStudentData } from "@/Urql/Types/Students/student.types";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";


//Interface
interface Inputs {
    studentId: string;
    class: string;
    section: string;
    group: string;
    shift: string;
    image: string;
    name: string;
    roll: string;
    session: string;
    gender: string;
    dob: DateValueType;
    blood: string;
    religion: string;
    number: string;
    email: string;
    fee_start: string;
    admissionDate: DateValueType;
    birthCertificate: string;
    fatherName: string;
    fatherNidNumber: string;
    fatherPhone: string;
    motherName: string;
    motherNidNumber: string;
    motherPhone: string;
    guardianName: string;
    guardianNidNumber: string;
    guardianPhone: string;
    address: string;
    school: string;
}

const Add = () => {
    //Initialize router
    const router = useRouter();

    //States
    const [images, setImages] = useState<ImageListType>([]);
    const [notification, setNotification] = useState(false);
    const [shift, setShift] = useState<{ id: string, name: string }[] | undefined>();
    const [section, setSection] = useState<{ id: string, name: string }[] | undefined>();
    const [group, setGroup] = useState<{ id: string, name: string }[] | undefined>();

    //Graphql Hooks
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });
    const [studentData] = useQuery<GetSingleStudentData>({ query: GET_SINGLE_STUDENT, variables: { getStudentId: router.query.id } });
    const [_, refetch] = useQuery<GetStudentListData>({ query: GET_STUDENT_LIST, variables: { studentPaginationInput: defaultVariable }, pause: true })
    const [{ data, error, fetching }, updateStudent] = useMutation<UpdateStudentData>(UPDATE_STUDENT);
    const [__, refetchAll] = useQuery<GetAllStudentData>({
        query: GET_ALL_STUDENT, variables: {
            studentPramsInput: {
                name: defaultVariable.name,
                id: defaultVariable.id,
                class: defaultVariable.class,
                shift: defaultVariable.shift,
                section: defaultVariable.section,
                group: defaultVariable.group
            }
        }
    });

    //Form
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control,
        setValue,
        watch
    } = useForm<Inputs>({
        defaultValues: {
            studentId: studentData.data?.getStudent.studentId,
            class: studentData.data?.getStudent?.class?.id,
            section: studentData.data?.getStudent.section?.id,
            shift: studentData.data?.getStudent.shift?.id,
            group: studentData.data?.getStudent.group?.id,
            image: studentData.data?.getStudent?.image,
            name: studentData.data?.getStudent?.name,
            roll: studentData.data?.getStudent?.roll,
            session: studentData.data?.getStudent?.session,
            gender: studentData.data?.getStudent?.gender,
            dob: { endDate: studentData.data?.getStudent.dob, startDate: studentData.data?.getStudent.dob },
            blood: studentData.data?.getStudent?.blood,
            religion: studentData.data?.getStudent?.religion,
            number: studentData.data?.getStudent?.number,
            email: studentData.data?.getStudent?.email,
            fee_start: studentData.data?.getStudent?.fee_start,
            admissionDate: { endDate: studentData.data?.getStudent.admissionDate, startDate: studentData.data?.getStudent.admissionDate },
            birthCertificate: studentData.data?.getStudent?.birthCertificate,
            fatherName: studentData.data?.getStudent?.fatherName,
            fatherNidNumber: studentData.data?.getStudent?.fatherNidNumber,
            fatherPhone: "+880 " + (studentData.data?.getStudent.fatherPhone.startsWith("880") ? studentData.data?.getStudent.fatherPhone.substring(3) : studentData.data?.getStudent.fatherPhone),
            motherName: studentData.data?.getStudent?.motherName,
            motherNidNumber: studentData.data?.getStudent?.motherNidNumber,
            motherPhone: studentData.data?.getStudent?.motherPhone,
            guardianName: studentData.data?.getStudent?.guardianName,
            guardianNidNumber: studentData.data?.getStudent?.guardianNidNumber,
            guardianPhone: studentData.data?.getStudent?.guardianPhone,
            address: studentData.data?.getStudent?.address,
            school: studentData.data?.getStudent?.school
        }
    });

    //Form Data
    const formData = watch().class;

    //On Image Change
    const onImageChange = async (imageList: ImageListType) => {
        setImages(imageList);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "student" });
        const res = await s3.uploadFile(imageList[0].file as File);
        setValue("image", res.key);
    };

    //Form Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        const ApiData = {
            ...value,
            fatherPhone: value.fatherPhone.replace(/\+/g, '').replace(/\s+/g, '').replace(/(88)0+(?!1)(\d+)/g, '$1$2').replace(/^0+/, ''),
            dob: value.dob?.startDate,
            admissionDate: value.admissionDate?.startDate
        };
        updateStudent({ studentInput: ApiData, updateStudentId: studentData.data?.getStudent.id }).then(() => {
            setNotification(true)
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
        })
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Get current years list
    const getYears = () => {
        const currentYear = dayjs().year()
        const years = [];
        for (let i = 0; i <= currentYear - 2013; i++) {
            years.push(currentYear - i);
        }
        return years;
    }

    useEffect(() => {
        if (formData) {
            const currentClass = classData.data?.getAllClass.find(item => item.id === formData)
            setShift(currentClass?.shift)
            setSection(currentClass?.section);
            setGroup(currentClass?.group);
        }
    }, [formData])
    return (
        <div className="pb-5">
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.updateStudent.message}
                </Notification>
            }
            <h3 className="text-base font-semibold mb-5">Edit Student</h3>
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
                                dragProps,
                                isDragging
                            }) => (
                                <div
                                    onClick={onImageUpload}
                                    className="w-36 h-36 cursor-pointer"
                                    {...dragProps}
                                >
                                    {imageList.length === 0 && !studentData.data?.getStudent?.image &&
                                        <div className="w-full h-full flex items-center justify-center border border-dashed border-textColor border-opacity-20 rounded-3xl">
                                            <Icon icon="ic:round-plus" className={`text-5xl opacity-25 ${isDragging && "text-main"}`} />
                                        </div>
                                    }
                                    {imageList.length > 0 && imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <Image src={image["ecampus"]} alt="" width={144} height={144} className="w-36 h-36 rounded-3xl" />
                                        </div>
                                    ))}
                                    {imageList.length === 0 && studentData.data?.getStudent?.image &&
                                        <div className="image-item">
                                            <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + studentData.data.getStudent.image} alt="" width={144} height={144} className="w-36 h-36 rounded-3xl" />
                                        </div>
                                    }
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
                                    label="Student Id"
                                    color="green"
                                    error={errors.studentId ? true : false}
                                    {...register("studentId", { required: true })}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="session"
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            label="Session"
                                            color="green"
                                            value={value}
                                            onChange={onChange}
                                            error={errors.session ? true : false}
                                        >
                                            {getYears().map((item, i) => (
                                                <Option key={i} value={item.toString()}>{item}</Option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-8">
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
                            label="Roll"
                            color="green"
                            error={errors.roll ? true : false}
                            {...register("roll", { required: true })}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="class"
                            key="class"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (classData?.data && classData.data.getAllClass.length === 0) return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        key="empty_class"
                                        onChange={onChange}
                                        error={errors.class ? true : false}
                                    >
                                        <Option disabled>Please Add Some Class First</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        key="not_empty_class"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.class ? true : false}
                                    >
                                        {classData.data?.getAllClass.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="shift"
                            key="shift"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!shift || shift.length === 0) return (
                                    <Select
                                        label="Shift"
                                        color="green"
                                        key="empty_shift"
                                        onChange={onChange}
                                        error={errors.shift ? true : false}
                                    >
                                        <Option disabled>{shift === undefined ? "Please select a class!" : "Not shift found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Shift"
                                        color="green"
                                        key="not_empty_shift"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.shift ? true : false}
                                    >
                                        {shift.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="section"
                            key="section"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!section || section.length === 0) return (
                                    <Select
                                        label="Section"
                                        color="green"
                                        key="empty_section"
                                        onChange={onChange}
                                        error={errors.section ? true : false}

                                    >
                                        <Option disabled>{group === undefined ? "Please select a class" : "No section found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Section"
                                        color="green"
                                        key="not_empty_section"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.section ? true : false}
                                    >
                                        {section.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="group"
                            key="group"
                            render={({ field: { onChange, value } }) => {
                                if (!group || group.length === 0) return (
                                    <Select
                                        label="Group"
                                        color="green"
                                        key="empty_group"
                                        onChange={onChange}
                                    >
                                        <Option disabled>{group === undefined ? "Please select a class" : "No group found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Group"
                                        color="green"
                                        key="not_empty_group"
                                        value={value}
                                        onChange={onChange}
                                    >
                                        {group.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
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
                            name="blood"
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    label="Blood Group"
                                    color="green"
                                    value={value}
                                    onChange={onChange}
                                >
                                    <Option value="O+">O+ (Positive)</Option>
                                    <Option value="O-">O- (Negative)</Option>
                                    <Option value="A+">A+ (Positive)</Option>
                                    <Option value="A-">A- (Negative)</Option>
                                    <Option value="B+">B+ (Positive)</Option>
                                    <Option value="B-">B- (Negative)</Option>
                                    <Option value="AB+">AB+ (Positive)</Option>
                                    <Option value="AB-">AB- (Negative)</Option>
                                </Select>
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="religion"
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    label="Religion"
                                    color="green"
                                    value={value}
                                    onChange={onChange}
                                >
                                    <Option value="islam">Islam</Option>
                                    <Option value="hinduism">Hinduism</Option>
                                    <Option value="christianity">Christianity</Option>
                                    <Option value="buddhism,">Buddhism</Option>
                                </Select>
                            )}
                        />
                    </div>
                    <div>
                        <Input
                            label="Number"
                            color="green"
                            {...register("number")}
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                            }}
                        />
                    </div>
                    <div>
                        <Input
                            label="Email"
                            color="green"
                            {...register("email")}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="admissionDate"
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
                                            label="Admission Date"
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
                            label="Birth Certificate Number"
                            color="green"
                            {...register("birthCertificate")}
                        />
                    </div>
                </div>
                <h2 className="text-base font-semibold text-main my-5">Fees Month</h2>
                <div>
                    <Controller
                        control={control}
                        name="fee_start"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                label="Fees Month"
                                color="green"
                                value={value}
                                onChange={onChange}
                                error={errors.fee_start ? true : false}
                            >
                                {Array.from({ length: 12 }).map((_, index) => {
                                    const month = dayjs().subtract(1, 'month').add(index, 'month').format('MMMM');
                                    return (
                                        <Option key={month} value={month}>
                                            {month}
                                        </Option>
                                    );
                                })}
                            </Select>
                        )}
                    />
                </div>
                <h2 className="text-base font-semibold text-main my-5">Parents Info</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Input
                            label="Father Name"
                            color="green"
                            {...register("fatherName", { required: true })}
                            error={errors.fatherName ? true : false}
                        />
                    </div>
                    <div>
                        <Input
                            label="Father Nid Number"
                            color="green"
                            {...register("fatherNidNumber")}
                        />
                    </div>
                    <div>
                        <Input
                            label="Father Phone"
                            color="green"
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                const formatted = e.target.value.trim()
                                    .replace(/[^0-9+]/g, "")
                                    .replace(/^(\+?88?)?0?/, "+880 ")
                                    .replace(/(\d{6})(?=\d)/g, "$1 ");
                                e.target.value = formatted
                            }}
                            {...register("fatherPhone", {
                                required: true,
                                minLength: 11
                            })}
                        />
                    </div>
                    <div>
                        <Input
                            label="Mother Name"
                            color="green"
                            {...register("motherName", { required: true })}
                            error={errors.motherName ? true : false}
                        />
                    </div>
                    <div>
                        <Input
                            label="Mother Nid Number"
                            color="green"
                            {...register("motherNidNumber")}
                        />
                    </div>
                    <div>
                        <Input
                            label="Mother Phone"
                            color="green"
                            {...register("motherPhone")}
                        />
                    </div>
                </div>
                <h2 className="text-base font-semibold text-main my-5">Other Guardian Info</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Input
                            label="Name"
                            color="green"
                            {...register("guardianName")}
                        />
                    </div>
                    <div>
                        <Input
                            label="Nid Number"
                            color="green"
                            {...register("guardianNidNumber")}
                        />
                    </div>
                    <div>
                        <Input
                            label="Phone Number"
                            color="green"
                            {...register("guardianPhone")}
                        />
                    </div>
                </div>
                <h2 className="text-base font-semibold text-main my-5">Other Info</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input
                            label="Address"
                            color="green"
                            {...register("address", { required: true })}
                            error={errors.address ? true : false}
                        />
                    </div>
                    <div>
                        <Input
                            label="School Name"
                            color="green"
                            {...register("school", { required: true })}
                            error={errors.school ? true : false}
                        />
                    </div>
                </div>
                <div className="my-8 text-center">
                    <Button
                        color="green"
                        className="bg-main py-2 px-6 relative"
                        type="submit"
                        disabled={fetching}
                    >
                        {fetching ? "Please Wait" : "Save Student"}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default Add;