import type { Restaurant } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Dot } from "lucide-react";

type Props = {
    restaurant: Restaurant;
};

const RestaurantInfo = ({ restaurant }: Props) => {
    return (
        <Card className="border-sla">
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">
                    {restaurant.restaurantName}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    <CardContent className="flex gap-50 items-end md:flex-row">
                        <div>
                            <p className="text-lg font-semibold">Addresse:</p>
                            <p>{restaurant.addressLine1}</p>
                            <p>{restaurant.zipCode} {restaurant.city}</p>
                            <p>{restaurant.state} / {restaurant.country}</p>
                        </div>
                        <div>
                            <p>{restaurant.phoneNumber}</p>
                            <p>{restaurant.emailRestaurant}</p>
                            <p>{restaurant.website}</p>
                        </div>
                    </CardContent>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex">
                {restaurant.cuisines.map((item, index) => (
                    <span className="flex">
                        <span>{item}</span>
                        {index < restaurant.cuisines.length - 1 && <Dot />}                                                   
                    </span>
                ))}
            </CardContent>
        </Card>
    );
};

export default RestaurantInfo;