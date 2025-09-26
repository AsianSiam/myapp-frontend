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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="profil" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Profil utilisateur</h2>
                    {activeTab === "profil" && (
                        <button
                            onClick={() => setActiveTab("manage-profile")}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm font-medium"
                        >
                            Éditer profil
                        </button>
                    )}                
                </div>
                <TabsContent value="profil" className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails du compte et du profil</h2>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Données personnelles</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p className="font-medium">{currentUser?.name} {currentUser?.firstname}</p>
                                    <p>{currentUser?.email}</p>                    
                                    <p>{formatDate(currentUser?.birthdate)}</p>                    
                                    <p>
                                      {currentUser?.indicatifTel && indicatifTelList.find(indicatif => indicatif.value === currentUser.indicatifTel)?.label 
                                        ? `${indicatifTelList.find(indicatif => indicatif.value === currentUser.indicatifTel)?.label} (${currentUser.indicatifTel})`
                                        : currentUser?.indicatifTel || 'Indicatif non défini'
                                      } {currentUser?.phoneNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Langue de communication</h3>
                                <p className="text-gray-700">{languages.find(lang => lang.value === currentUser?.language)?.label || currentUser?.language}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pseudo</h3>
                                <p className="text-gray-700">{currentUser?.nickname}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p className="font-medium">{currentUser?.name} {currentUser?.firstname}</p>
                                    <p>{currentUser?.addressLine1}</p>
                                    <p>{currentUser?.zipCode} {currentUser?.city}</p>
                                    <p>{currentUser?.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="manage-profile">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <UserProfileForm currentUser={currentUser} onSave={handleUpdateUser} onCancel={handleCancel} isLoading={isUpdateLoading} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default UserProfilePage;