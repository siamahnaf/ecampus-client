import { useContext, useState } from "react";
import { Typography, Input, Textarea } from "@material-tailwind/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import ReactS3Client from "react-s3-typescript";

//S3 Config
import { s3Config } from "@/Utilis/s3.config";

//Components
import ImageUpload from "@/Components/Common/ImageUpload";

//Context
import { SiteContext } from "@/Context/site-context";

const Seo = () => {
    //State
    const [image, setImage] = useState<ImageListType>([]);

    //Context
    const { register, setValue, getValues } = useContext(SiteContext);

    //Handler
    const onImageHandler = async (imageList: ImageListType) => {
        setImage(imageList);
        const s3 = new ReactS3Client({ ...s3Config, dirName: "settings" });
        const res = await s3.uploadFile(imageList[0].file as File);
        setValue?.("ogImage", res.key);
    };

    return (
        <div className="my-4">
            <Typography variant="h6" className="font-medium mb-3">
                General Information
            </Typography>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        label="Meta Title"
                        color="green"
                        {...register?.("metaTitle")}
                    />
                </div>
                <div>
                    <Input
                        label="Og Title"
                        color="green"
                        {...register?.("ogTitle")}
                    />
                </div>
                <div>
                    <Textarea
                        label="Meta Description"
                        color="green"
                        {...register?.("metaDescription")}
                        rows={5}
                    />
                </div>
                <div>
                    <Textarea
                        label="Og Description"
                        color="green"
                        {...register?.("ogDescription")}
                        rows={5}
                    />
                </div>
                <div className="col-span-2">
                    <Textarea
                        label="Meta Tag"
                        color="green"
                        {...register?.("metaTag")}
                        rows={5}
                    />
                </div>
                <div className="col-span-2">
                    <p className="text-sm font-medium mb-2">Upload Og Image</p>
                    <ImageUploading
                        value={image}
                        onChange={onImageHandler}
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
                                image={getValues?.("ogImage") as string}
                                onImageRemove={onImageRemove}
                            />
                        )}
                    </ImageUploading>
                </div>
                <div className="col-span-2">
                    <Input
                        label="Og URL"
                        color="green"
                        {...register?.("ogUrl")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Seo;