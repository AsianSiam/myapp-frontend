import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

const ImageSection = () => {

    const { control, watch } = useFormContext();
    const existingImageUrl = watch("imageUrl");

    return (
        <div className="space-y-2">
            <div>
                <h2 className="text-lg font-medium">Restaurant Image</h2>
            <FormDescription>
                <p>Upload an image for your restaurant. Adding a new image will overwrite the existing one.</p>
            </FormDescription>
            </div>
            <div className="flex flex-col gap-8 md:w-[50%]">
                {existingImageUrl && (
                    <AspectRatio ratio={16 / 9}>
                        <img src={existingImageUrl} alt="Restaurant" className="object-cover w-full h-full" />
                    </AspectRatio>
                )}
                <FormField
                    control={control}
                    name="imageFile"
                    render={({ field }) => <FormItem>
                        <FormControl>
                            <Input className="bg-white" type="file" accept=".jpg, .jpeg, .png" onChange={(event) => field.onChange(event.target.files ? event.target.files[0] : null)} />
                        </FormControl>
                    </FormItem>}
                />
            </div>
        </div>
    );
};

export default ImageSection;
