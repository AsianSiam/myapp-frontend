import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  email, z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import CuisineSection from "./CuisineSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import type { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
    restaurantName: z.string().nonempty("Restaurant name is required"),
    addressLine1: z.string().nonempty("Address is required"),
    city: z.string().nonempty("City is required"),
    zipCode: z.number().min(1, "Zip code is required"),
    state: z.string().nonempty("State is required"),
    country: z.string().nonempty("Country is required"),
    phoneNumber: z.number().min(1, "Phone number is required"),
    website: z.string().url("Website must be a valid URL").optional().or(z.literal("")),
    emailRestaurant: z.string().email("Email must be a valid email address").or(z.literal("")),
    deliveryPrice: z.coerce.number().min(1, "Delivery price must be positive"),
    estimatedDeliveryTime: z.coerce.number().min(1, "Estimated delivery time must be positive"),
    cuisines: z.array(z.string()).nonempty("At least one cuisine is required"),
    menuItems: z.array(z.object({
        name: z.string().nonempty("Menu item name is required"),
        price: z.coerce.number().min(1, "Menu item price must be positive"),
    })),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "Image file is required" }).optional(), // Make imageFile optional to allow updates without changing the image
    })
    .refine((data) => data.imageUrl || data.imageFile, { message: "At least one image is required", path: ["imageUrl"]         
    });


type restaurantFormData = z.infer<typeof formSchema>

type Props = {
    restaurant?: Restaurant;
    onSave: (restaurantFormData: FormData) => void;
    isLoading: boolean;
}
const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
    const form = useForm<restaurantFormData>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            restaurantName: "",
            addressLine1: "",
            city: "",
            zipCode: 1,
            phoneNumber: 1,
            website: "",
            emailRestaurant: "",
            state: "",
            country: "",
            deliveryPrice: 1,
            estimatedDeliveryTime: 1,
            cuisines: [],
            menuItems: [{ name: "", price: 1 }],
            imageFile: undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (!restaurant) {
            return;
        }
        const deliveryPriceFormatted = Number((restaurant.deliveryPrice / 100).toFixed(2));

        const menuItemsFormatted = restaurant.menuItems.map((item) => ({
            ...item,
            price: Number((item.price / 100).toFixed(2)),
        }));

        const updateRestaurant = {
            ...restaurant,
            deliveryPrice: deliveryPriceFormatted,
            menuItems: menuItemsFormatted,   
            zipCode: Number(restaurant.zipCode),
            phoneNumber: Number(restaurant.phoneNumber),         
        }
        form.reset(updateRestaurant);
    }, [form, restaurant]);

    const onSubmit: SubmitHandler<restaurantFormData> = (formDataJson) => {
        // Filter out empty cuisines
        const filteredCuisines = formDataJson.cuisines.filter((c) => c && c.trim() !== "");
        if (filteredCuisines.length === 0) {
        // Optionally show a toast or error message here
        toast.error("Please select at least one cuisine.");
        return;
    }
        // Convert form data JSON to FormData object
        const formData = new FormData();
        formData.append("restaurantName", formDataJson.restaurantName);
        formData.append("addressLine1", formDataJson.addressLine1);
        formData.append("city", formDataJson.city);
        formData.append("state", formDataJson.state);
        formData.append("country", formDataJson.country);
        formData.append("zipCode", formDataJson.zipCode.toString());
        formData.append("phoneNumber", formDataJson.phoneNumber.toString());
        formData.append("emailRestaurant", formDataJson.emailRestaurant || "");
        formData.append("website", formDataJson.website || "");
        // Convert dollars to cents for deliveryPrice
        formData.append("deliveryPrice", Math.round(Number(formDataJson.deliveryPrice * 100)).toString());
        formData.append("estimatedDeliveryTime", formDataJson.estimatedDeliveryTime.toString());
        filteredCuisines.forEach((cuisine, index) => {
            formData.append(`cuisines[${index}]`, cuisine);
        });
        formDataJson.menuItems.forEach((menuItem, index) => {
            formData.append(`menuItems[${index}][name]`, menuItem.name);
            formData.append(`menuItems[${index}][price]`, Math.round(Number(menuItem.price * 100)).toString());
        });

        if (formDataJson.imageFile) {
            formData.append("imageFile", formDataJson.imageFile || "");
        }
        for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
        }
        onSave(formData);
    }
    
    console.log(form.formState.errors);
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-50 p-10 rounded-lg"> 
                <DetailsSection />
                    <Separator />
                <CuisineSection />
                    <Separator />
                <MenuSection />
                    <Separator />
                <ImageSection />
                    {isLoading ? <LoadingButton /> : <Button type="submit">Save</Button>}
            </form>                
            </Form>
    );
};

export default ManageRestaurantForm;