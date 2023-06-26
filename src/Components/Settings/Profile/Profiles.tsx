import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Components
import { Notification } from "@/Components/Common/Notification";

//Graphql
import { useQuery, useMutation } from "urql";
import { GET_PROFILE, UPDATE_PROFILE } from "@/Urql/Query/Account/profile.query";
import { GetProfileData, UpdateProfileData } from "@/Urql/Types/Account/profile.types";

//Interface
interface Inputs {
    name: string;
    image: string;
}

const Profiles = () => {
    //State
    const [images, setImages] = useState<ImageListType>([]);
    const [notification, setNotification] = useState(false);

    //Graphql
    const [{ data }] = useQuery<GetProfileData>({ query: GET_PROFILE });
    const [updateData, updateProfile] = useMutation<UpdateProfileData>(UPDATE_PROFILE);

    //For Initializing
    const {
        register,
        handleSubmit,
        setValue
    } = useForm<Inputs>({
        defaultValues: {
            name: data?.getProfile?.name,
            image: data?.getProfile?.image
        }
    });

    //Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateProfile({ profileInput: value }).then(() => {
            setNotification(true);
        });
    };

    //Handler
    const onChange = async (imageList: ImageListType) => {
        setImages(imageList);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "profile" });
        const res = await s3.uploadFile(imageList[0].file as File);
        setValue("image", res.key);
    };

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    return (
        <div>
            {(updateData.error || updateData.data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={updateData.error?.message ? "error" : "success"}
                >
                    {updateData.error?.message ?? updateData.data?.updateProfile.message}
                </Notification>
            }
            <Typography variant="h6" className="uppercase">
                Profile
            </Typography>
            <Typography variant="small" className="opacity-50 mt-1">
                Your info about name, image can be edit here.
            </Typography>
            <div className="mt-6">
                <ImageUploading
                    value={images}
                    onChange={onChange}
                    dataURLKey="ecampus"
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        isDragging,
                        dragProps,
                    }) => (
                        <div>
                            {imageList.length === 0 && !data?.getProfile?.image &&
                                <div className={`border border-dashed text-center select-none cursor-pointer py-3 rounded-md w-[35%] ${isDragging ? "border-main border-opacity-100" : "border-textColor border-opacity-50"}`} {...dragProps} onClick={onImageUpload}>
                                    <Icon className={`inline text-5xl ${isDragging ? "text-main opacity-100" : "opacity-25"}`} icon="ic:outline-cloud-upload" />
                                    <p className="mt-2 text-base"><span className="font-bold">Upload an File </span><span className="opacity-40">or drag and drop <br />Image</span></p>
                                </div>
                            }
                            {imageList.length > 0 && !data?.getProfile?.image &&
                                imageList.map((image, i) => (
                                    <div className="border border-dashed border-textColor border-opacity-50 py-5 rounded-md px-4 w-[35%]" key={i}>
                                        <div className="flex gap-5 items-center">
                                            <div>
                                                <Image src={image["ecampus"]} alt="Image" width={800} height={800} className="rounded-full w-[65px] h-[65px]" />
                                            </div>
                                            <div>
                                                <Typography variant="h6">
                                                    Edit your photo
                                                </Typography>
                                                <div className="flex gap-4 mt-2">
                                                    <button className="text-sm text-red-600" onClick={() => onImageRemove(i)}>Delete</button>
                                                    <button className="text-sm text-blue-600" onClick={onImageUpload}>Upload New</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {data?.getProfile?.image && imageList.length === 0 &&
                                <div className="border border-dashed border-textColor border-opacity-50 py-5 rounded-md px-4 w-[35%]">
                                    <div className="flex gap-5 items-center">
                                        <div>
                                            <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + data.getProfile?.image} alt="Image" width={800} height={800} className="rounded-full w-[65px] h-[65px]" />
                                        </div>
                                        <div>
                                            <Typography variant="h6">
                                                Edit your photo
                                            </Typography>
                                            <div className="flex gap-4 mt-2">
                                                <button className="text-sm text-red-600" disabled>Delete</button>
                                                <button className="text-sm text-blue-600" onClick={onImageUpload}>Upload New</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                </ImageUploading>
                <form className="grid grid-cols-2 gap-5 mt-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-start-1">
                        <Input
                            label="Full Name"
                            color="green"
                            {...register("name")}
                        />
                    </div>
                    <div className="col-start-1">
                        <Input
                            label="Phone number"
                            color="green"
                            readOnly
                            value={"+" + data?.getProfile.phone}
                        />
                    </div>
                    <div className="col-start-1">
                        <Input
                            label="Role"
                            color="green"
                            readOnly
                            className="capitalize"
                            value={data?.getProfile.role}
                        />
                    </div>
                    <div className="col-start-1 flex gap-2 items-center">
                        <Button color="green" className="bg-main py-2.5 px-6" type="submit">
                            Save Profile
                        </Button>
                        <div>
                            {updateData.fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profiles;