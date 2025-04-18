import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import useAuth from "../../../hooks/useAuth";
import DashboardDialog from "./dialog";

const DashboardList = () => {
    const [locations, setLocations] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const fetchLocations = async () => {
        try {
            const response = await axiosPrivate.get("/location");
            setLocations(response.data);
        } catch (error: any) {
            console.error("Error fetching locations: ", error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [auth, axiosPrivate]);

    const handleLocationClick = (location: any) => {
        setSelectedLocation(location);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedLocation(null);
    };

    return (
        <div className="location-box">
            {locations?.length ? (
                locations.map((location: any) => (
                    <div key={location.locationId} className="location-item" onClick={() => handleLocationClick(location)}>
                        <h2 className="title">
                            {location.name}
                        </h2>
                        <span className="type">
                            {location.type}
                        </span>
                        <p className="desc">
                            {location.description}
                        </p>
                    </div>
                ))
            ) : (
                <p className="locations-table__no-data">No location found</p>
            )}

            <DashboardDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                location={selectedLocation}
                onUpdate={fetchLocations}
            />
        </div>
    );
};

export default DashboardList;