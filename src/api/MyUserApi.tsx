import { useMutation, useQuery } from 'react-query';
import { toast } from "sonner"
import type { User } from "@/types"
import { useAuth0Token } from "@/hooks/useAuth0Token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = (enabled: boolean = true) => {
  const { getTokenSafely } = useAuth0Token();
  
  const getMyUserRequest = async (): Promise<User> => {
    try {
      const accessToken = await getTokenSafely();

      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json',
          },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    } catch (error) {
      console.error('Error getting access token or fetching user:', error);
      throw error;
    }
  };

  const { data: currentUser, isLoading, error, refetch } = useQuery(
    "fetchCurrentUser", 
    getMyUserRequest,
    {
      enabled: enabled // Seulement exécuter si enabled=true
    }
  );

  if(error) {
    toast.error(error.toString());
  }
  return { currentUser, isLoading, refetch };
};

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const { getTokenSafely } = useAuth0Token();

  const createMyUserRequest = async (user: CreateUserRequest) => {
    try {
      const accessToken = await getTokenSafely();

      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json',
          },
          body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Error getting access token or creating user:', error);
      throw error;
    }
  };

  const { mutateAsync: createUser, isLoading, isError, isSuccess} = useMutation(createMyUserRequest);

    return { createUser, isLoading, isError, isSuccess };
};

type updateMyUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  zipCode: number;
  phoneNumber: number;
  indicatifTel: string;
  language: string;
  birthdate?: string;
  nickname?: string;
  firstname: string;
  email?: string;
};


export const useUpdateMyUser = () => {
  const { getTokenSafely } = useAuth0Token();

  const updateMyUserRequest = async (formData: updateMyUserRequest) => {
    try {
      const accessToken = await getTokenSafely();

      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),    
      });
      
      if(!response.ok){
        throw new Error("Failed to update user")
      }
      return response.json();
    } catch (error) {
      console.error('Error getting access token or updating user:', error);
      throw error;
    }
  };

  const { mutateAsync: updateUser, isLoading, isSuccess, isError, error, reset } = useMutation(updateMyUserRequest);

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateUser, isLoading, isSuccess, isError, error, reset };

};