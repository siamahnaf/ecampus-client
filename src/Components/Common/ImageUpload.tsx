import { ImageListType, } from "react-images-uploading";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import { Icon } from "@iconify/react";

//Interface
interface Props {
    imageList: ImageListType;
    isDragging: Boolean;
    dragProps: any;
    onImageUpload: () => void;
    image: string;
    onImageRemove: (index: number) => void
}

const ImageUpload = ({ imageList, isDragging, dragProps, onImageUpload, image, onImageRemove }: Props) => {
    return (
        <div>
            {imageList.length === 0 && !image &&
                <div className={`border border-dashed text-center select-none cursor-pointer py-3 rounded-md w-full ${isDragging ? "border-main border-opacity-100" : "border-textColor border-opacity-50"}`} {...dragProps} onClick={onImageUpload}>
                    <Icon className={`inline text-5xl ${isDragging ? "text-main opacity-100" : "opacity-25"}`} icon="ic:outline-cloud-upload" />
                    <p className="mt-2 text-base"><span className="font-bold text-main">Upload an File </span><span className="opacity-40">or drag and drop <br />Image</span></p>
                </div>
            }
            {imageList.length > 0 && !image &&
                imageList.map((image, i) => (
                    <div className="border border-dashed border-textColor border-opacity-50 py-8 rounded-md px-4 w-full" key={i}>
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
            {image && imageList.length === 0 &&
                <div className="border border-dashed border-textColor border-opacity-50 py-8 rounded-md px-4 w-full">
                    <div className="flex gap-5 items-center">
                        <div>
                            <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + image} alt="Image" width={800} height={800} className="rounded-full w-[65px] h-[65px]" />
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
    );
};

export default ImageUpload;