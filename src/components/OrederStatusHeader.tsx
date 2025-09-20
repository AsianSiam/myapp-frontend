import type { Order } from "@/types";
import { ORDER_STATUS } from "@/config/order-status-config";

type Props = {
    order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {

    const getExpectedDelivery = () => {
        const created = new Date(order.createdAt);

        created.setDate(created.getDate() + 7); // Add 7 days for expected delivery
        return created.toLocaleDateString();
    };

    const getOrderStatusInfo = () => {
        return (
        ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
        );
    };
    
    return (
        <>
            <div className="text-2xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
                <span> Order Status: {getOrderStatusInfo().label}</span>
                <span> Expected Delivery: {getExpectedDelivery()}</span>
            </div>
            <br />
            {/* Barre de progression HTML/CSS */}
            <div className="w-full">
                {/* Container de la barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                    {/* Barre de progression remplie */}
                    <div 
                        className="h-4 rounded-full transition-all duration-700 ease-in-out"
                        style={{ 
                            width: `${getOrderStatusInfo().progressValue}%`,
                            background: getOrderStatusInfo().progressValue === 100 
                                ? 'linear-gradient(90deg, #10b981, #059669)' // Vert pour livré
                                : getOrderStatusInfo().progressValue >= 75 
                                ? 'linear-gradient(90deg, #f59e0b, #d97706)' // Orange pour en livraison
                                : getOrderStatusInfo().progressValue >= 25 
                                ? 'linear-gradient(90deg, #3b82f6, #2563eb)' // Bleu pour confirmé
                                : 'linear-gradient(90deg, #6b7280, #4b5563)' // Gris pour placé
                        }}
                    />
                </div>                
                {/* Informations sous la barre */}
                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">
                        Progress: {getOrderStatusInfo().progressValue}%
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                        Status: {getOrderStatusInfo().label}
                    </p>
                </div>
            </div>
        </>
    );
};

export default OrderStatusHeader;