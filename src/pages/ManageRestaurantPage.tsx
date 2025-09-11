import ManageRestaurantForm from "../forms/manager-restaurant-form/ManageRestaurantForm";
import { useCreateMyRestaurant, useGetMyRestaurant } from "@/api/MyRestaurantApi";
import { useUpdateMyRestaurant } from "@/api/MyRestaurantApi";


const ManageRestaurantPage = () => {
    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
    const { restaurant } = useGetMyRestaurant();
    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

    const isEditting = !!restaurant;
    console.log("isEditting", isEditting);
    console.log("restaurant", restaurant);
    return (
            <ManageRestaurantForm onSave={isEditting ? updateRestaurant : createRestaurant} isLoading={isCreateLoading || isUpdateLoading} restaurant={restaurant} />
    );
};
export default ManageRestaurantPage;