import Icon from "@mdi/react";
import { mdiCog, mdiPlusBox } from "@mdi/js";

import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import Table from "../../../components/table";
import LocationDialog from "./dialog";

const LocationsList = () => {
    const [locations, setLocations] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const axiosPrivate = useAxiosPrivate();

    const fetchLocations = async () => {
        try {
            const response = await axiosPrivate.get("/location/all");
            setLocations(response.data);
        } catch (error: any) {
            console.error("Error fetching users: ", error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [axiosPrivate]);

    const headers = ["Name", "Type", "hourlyRate", "Creation Date", "Minimum Time", "Maximum Time", "Actions"];
        const data = locations.map((location: any) => ({
            Name: location.name,
            Type: location.type,
            hourlyRate: location.hourlyRate,
            "Minimum Time": location.minimumTime,
            "Maximum Time": location.maximumTime,
            "Creation Date": new Date(location.creationDate).toLocaleDateString(),
            Actions: (
                <button
                    onClick={() => handleIconClick(location)}
                    className="icon-button"
                >
                    <Icon path={mdiCog} size={1} color="currentColor" />
                </button>
            ),
        }));
    
        const handleIconClick = (user: any) => {
            setSelectedLocation(user);
            setIsDialogOpen(true);
        };
    
        const handleCloseDialog = () => {
            setIsDialogOpen(false);
            setSelectedLocation(null);
        };

        const handleAddLocation = () => {
            setSelectedLocation(null);
            setIsDialogOpen(true);
        }

    return (
        <div className={'locations-box' + (locations?.length ? '' : ' full')}>
            <button className="btn add" onClick={handleAddLocation}>
                <Icon path={mdiPlusBox} size={1} />
            </button>
            {locations?.length ? (
                <Table
                    headers={headers}
                    data={data}
                />
            ) : (
                <p className="no-locations">No locations found</p>
            )}

            <LocationDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                location={selectedLocation}
                onUpdate={fetchLocations}
            />
        </div>
    );
}

export default LocationsList;