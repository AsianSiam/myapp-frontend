import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, { type UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
    onCheckout: (userFormData: UserFormData) => void;
    disabled: boolean;
    isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading}: Props) => {
    const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();

    const { pathname } = useLocation();
    const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();
    
    const onLogin = () => {
        loginWithRedirect({
            appState: { returnTo: pathname },
        });
    }

    if (isLoading || !currentUser || isAuthLoading) {
        return <LoadingButton />;
    }

    if (!isAuthenticated) {
       return <Button onClick={onLogin} className="bg-blue-500 text-white">Login to checkout</Button>;
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={disabled} className="bg-blue-500 text-white">Proceed to checkout</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
                <UserProfileForm currentUser={currentUser} onSave={onCheckout} isLoading={isGetUserLoading} buttonText="Continue to payment" title="Confirm Delivery Details" />
            </DialogContent>
        </Dialog>
    )
};

export default CheckoutButton;
