import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';
import type { Restaurant } from '@/types';
import type { Order } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyRestaurantRequest = async (): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Backend error:", errorData);
            throw new Error('Failed to fetch restaurant');
        }
        return response.json();
    };
    const { data: restaurant, isLoading } = useQuery('fetchMyRestaurant', getMyRestaurantRequest);
    return { restaurant, isLoading };
};

export const useCreateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyRestaurantRequest = async (restaurantFormData: FormData): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData,
        });

        if (!response.ok) {      
             const errorData = await response.json().catch(() => ({}));
            console.error("Backend validation error:", errorData);      
            throw new Error('Failed to create restaurant');
        }
        return response.json();
    };
    
    const { mutate: createRestaurant, isLoading, isSuccess, error, } = useMutation(createMyRestaurantRequest);

    if (isSuccess) {
        toast.success('Restaurant created successfully!');
    }

    if (error) {
        toast.error('Error creating restaurant');
    }
    return { createRestaurant, isLoading };
};

export const useUpdateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyRestaurantRequest = async (restaurantFormData: FormData): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Backend validation error:", errorData);
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    };
    const { mutate: updateRestaurant, isLoading, isSuccess, error } = useMutation(updateMyRestaurantRequest);

    if (isSuccess) {
        toast.success('Restaurant updated successfully!');
    }

    if (error) {
        toast.error('Error updating restaurant');
    }

    return { updateRestaurant, isLoading };
};

export const useGetMyRestaurantOrders = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Backend error:", errorData);
            throw new Error('Failed to fetch restaurant orders');
        }
        return response.json();
    };

    const { data: orders, isLoading } = useQuery('fetchMyRestaurantOrders', getMyRestaurantOrdersRequest);
    return { orders, isLoading };
};


type UpdateOrderStatusRequest = {
    orderId: string;
    status: string;
};

export const useUpdateOrderStatus = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyRestaurantOrder = async (updateStatusOrderRequest: UpdateOrderStatusRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order/${updateStatusOrderRequest.orderId}/status`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: updateStatusOrderRequest.status }),
        });

        if (!response.ok) {;
            throw new Error('Failed to update order status');
        }
        return response.json();
    };

    const { mutateAsync: updateRestaurantStatus, isLoading, isSuccess, isError, reset } = useMutation(updateMyRestaurantOrder);

    if (isSuccess) {
        toast.success('Order status updated successfully!');
    }

    if (isError) {
        toast.error('Error updating order status');
        reset();
    }

    return { updateRestaurantStatus, isLoading };
};