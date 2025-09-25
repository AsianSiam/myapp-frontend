import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm, { type UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { languages } from "@/config/language-config";
import { indicatifTelList } from "@/config/indicatif-phone-config";
import { useEffect, useState } from "react";

const UserProfilePage = () => {
    const { currentUser, isLoading: isGetLoading, refetch } = useGetMyUser();
    const { updateUser, isLoading: isUpdateLoading, isSuccess } = useUpdateMyUser();

    const [activeTab, setActiveTab] = useState("profil");

    useEffect(() => {
        if (isSuccess) {
            setActiveTab("profil");
            refetch();
        }
    }, [isSuccess])

        const handleUpdateUser = async (userProfileData: UserFormData) => {
        try {            
            await updateUser(userProfileData);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleCancel = () => {
        setActiveTab("profil");
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    if (isGetLoading) {
        return <span>Loading...</span>;
    }
    if (!currentUser) {
        return <span>Unable to load user profile</span>
    }

    return (
        <div>
            <Tabs defaultValue="profil" value={activeTab} onValueChange={setActiveTab} >
                <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Profil utilisateur</h2>
                {
                activeTab === "profil" && (
                    <button
                    onClick={() => setActiveTab("manage-profile")}
                    className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-gray-300 transition"
                >
                        Editer profil
                    </button>
                )}                
            </div>
                <TabsContent value="profil" className="space-y-5 bg-gray-50 pg-8 rounded-lg">
                    <h2 className="text-xl font-bold">Détails du compte et du profil</h2>
                    <span className="text-xl font-semibold">Données personnelles</span><br />
                    <span>{currentUser?.name} {currentUser?.firstname}</span><br />
                    <span>{currentUser?.email}</span><br />                    
                    <span>{formatDate(currentUser?.birthdate)}</span><br />                    
                    <span>
                      {currentUser?.indicatifTel && indicatifTelList.find(indicatif => indicatif.value === currentUser.indicatifTel)?.label 
                        ? `${indicatifTelList.find(indicatif => indicatif.value === currentUser.indicatifTel)?.label} (${currentUser.indicatifTel})`
                        : currentUser?.indicatifTel || 'Indicatif non défini'
                      } {currentUser?.phoneNumber}
                    </span><br />
                    <br />
                    <span className="text-xl font-semibold">Langue de communication</span><br />
                    <span>{languages.find(lang => lang.value === currentUser?.language)?.label || currentUser?.language}</span><br />
                    <br />
                    <span className="text-xl font-semibold">Pseudo</span><br />
                    <span>{currentUser?.nickname}</span><br />
                    <br />
                    <span className="text-xl font-bold">Adresse</span><br />
                    <span>{currentUser?.name} {currentUser?.firstname}</span><br />
                    <span>{currentUser?.addressLine1}</span><br />
                    <span>{currentUser?.zipCode} {currentUser?.city}</span><br />
                    <span>{currentUser?.country}</span><br />
                </TabsContent>
                <TabsContent value="manage-profile" className="bg-gray-50 p-8 rounded-lg">
                    <UserProfileForm currentUser={currentUser} onSave={handleUpdateUser} onCancel={handleCancel} isLoading={isUpdateLoading} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default UserProfilePage;