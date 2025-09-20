import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusHeader from "../components/OrederStatusHeader";
import OrderStatusDetail from "../components/OrderStatusDetail";

const OrderStatusPage = () => {
    const { orders, isLoading } = useGetMyOrders();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
        return <div>No orders found.</div>;
    }

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold">Commandes:</h1>
            <div>
                {orders.map((order) => (
                    <div className="space-y-10 bg-gray-100 p-8 rounded-lg">                                           
                        <OrderStatusHeader order={order} />
                        <div>
                            <OrderStatusDetail order={order} restaurant={order.restaurant} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusPage;