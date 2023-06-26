import { useContext, useState } from "react";
import { Typography, Input } from "@material-tailwind/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Components
import ImageUpload from "@/Components/Common/ImageUpload";

//Context
import { SiteContext } from "@/Context/site-context";

const General = () => {
    //State
    const [icons, setIcons] = useState<ImageListType>([]);
    const [logos, setLogos] = useState<ImageListType>([]);

    //Context
    const { register, setValue, getValues } = useContext(SiteContext);

    //Handler
    const onIconHandler = async (imageList: ImageListType) => {
        setIcons(imageList);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "settings" });
        const res = await s3.uploadFile(imageList[0].file as File);
        setValue?.("icon", res.key);
    };

    //Handler
    const onLogoHandler = async (imageList: ImageListType) => {
        setLogos(imageList);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "settings" });
        const res = await s3.uploadFile(imageList[0].file as File);
        setValue?.("logo", res.key);
    };

    return (
        <div className="my-4">
            <Typography variant="h6" className="font-medium mb-3">
                General Information
            </Typography>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium mb-2">Upload Icon</p>
                    <ImageUploading
                        value={icons}
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
                                image={getValues?.("icon") as string}
                                onImageRemove={onImageRemove}
                            />
                        )}
                    </ImageUploading>
                </div>
                <div>
                    <p className="text-sm font-medium mb-2">Upload Logo</p>
                    <ImageUploading
                        value={logos}
                        onChange={onLogoHandler}
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
                                image={getValues?.("logo") as string}
                                onImageRemove={onImageRemove}
                            />
                        )}
                    </ImageUploading>
                </div>
                <div>
                    <Input
                        label="Website Name"
                        color="green"
                        {...register?.("name")}
                    />
                </div>
                <div>
                    <Input
                        label="Slogan"
                        color="green"
                        {...register?.("slogan")}
                    />
                </div>
                <div>
                    <Input
                        label="Website URL"
                        color="green"
                        {...register?.("url")}
                    />
                </div>
            </div>
        </div>
    );
};

export default General;