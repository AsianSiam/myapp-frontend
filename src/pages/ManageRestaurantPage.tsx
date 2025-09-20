import ManageRestaurantForm from "../forms/manager-restaurant-form/ManageRestaurantForm";
import { useCreateMyRestaurant, useGetMyRestaurant } from "@/api/MyRestaurantApi";
import { useUpdateMyRestaurant } from "@/api/MyRestaurantApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetMyRestaurantOrders } from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";


const ManageRestaurantPage = () => {
    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
    const { restaurant } = useGetMyRestaurant();
    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

    const isEditting = !!restaurant;
    console.log("isEditting", isEditting);
    console.log("restaurant", restaurant);

    const { orders } = useGetMyRestaurantOrders();

    return (
        <Tabs defaultValue="orders" className="w-full">
            <TabsList>
                <TabsTrigger value="orders">Commandes</TabsTrigger>
                <TabsTrigger value="manage-restaurant">Gérer mon restaurant</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-5 bg-gray-50 pg-8 rounded-lg">
                <h2 className="text-2xl font-bold">{orders?.length} Commandes en attente</h2>
                {orders?.map((order) => (
                    <OrderItemCard order={order} restaurant={restaurant!} />
                ))}
            </TabsContent>
            <TabsContent value="manage-restaurant" className="bg-gray-50 p-8 rounded-lg">
                <ManageRestaurantForm onSave={isEditting ? updateRestaurant : createRestaurant} isLoading={isCreateLoading || isUpdateLoading} restaurant={restaurant} />
            </TabsContent>
        </Tabs>
    );
};
export default ManageRestaurantPage;