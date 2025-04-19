import { useState } from "react";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import { mdilMagnify } from '@mdi/light-js';
import Icon from "@mdi/react";
import { toast } from "react-toastify";
import DialogConfirm from "../../../components/dialog/confirm";

const DashboardList = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [diffInHours, setDiffInHours] = useState<any>(null);

    const axiosPrivate = useAxiosPrivate();

    const fetchLocations = async () => {
        const formattedReservation = reservation.toISOString().slice(0, 19);
        const formattedExit = exit.toISOString().slice(0, 19);

        try {
            const response = await axiosPrivate.get("/location/available?checkIn=" + formattedReservation + "&checkOut=" + formattedExit);
            setLocations(response.data);
            setDiffInHours(Math.abs(new Date(formattedExit).getTime() - new Date(formattedReservation).getTime()) / (1000 * 60 * 60));
            
        } catch (err: any) {
            if (!err?.response) {
                toast.error('No server response');
            } else {
                for (let i = 0; i < err.response.data.length; i++) {
                    toast.error(err.response.data[i].message);
                }
            }
        }
    };

    const [reservation, setReservation] = useState(new Date());
    const [reservationSelected, setReservationSelected] = useState(false);
    const [exit, setExit] = useState(new Date());
    const [exitSelected, setExitSelected] = useState(false);

    return (
        <div className="list-content">
            <div className="date-box">
                <div className="form-group input-label">
                    <label htmlFor="reservation-time">
                        Select the date/time of entry:
                    </label>
                    <input
                        type="datetime-local"
                        id="reservation-time"
                        className="form-control"
                        onChange={(e) => {
                            setReservation(new Date(e.target.value));
                            setReservationSelected(true)
                        }}
                    />
                </div>
                <div className="form-group input-label">
                    <label htmlFor="exit-time">
                        Select the date/time of exit:
                    </label>
                    <input
                        type="datetime-local"
                        id="exit-time"
                        className="form-control"
                        onChange={(e) => {
                            setExit(new Date(e.target.value))
                            setExitSelected(true);
                        }}
                    />
                </div>
                <div className="search-btn">
                    <button className="btn"
                        disabled={!reservationSelected || !exitSelected}
                        onClick={() => fetchLocations()}>
                        <Icon path={mdilMagnify} size={1.2} />
                    </button>
                </div>
            </div>

            {locations.length > 0 ? (
                <div className="location-list">
                    {locations.map((location: any) => (
                        <div key={location.locationId} className="location-item" onClick={() => {
                            setSelectedLocation(location);
                            setDialogOpen(true);
                        }}>
                            <h3>{location.name}</h3>
                            <p>Hourly Rate: ${(location.hourlyRate).toFixed(2)}</p>
                            <p>Price: ${(location.hourlyRate * diffInHours).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-locations">
                    No locations available for the selected date/time
                </div>
            )}

            <DialogConfirm
                isOpen={dialogOpen}
                content={`Are you sure you want to reserve ${selectedLocation?.name}?`}
                onClose={() => setDialogOpen(false)}
                onConfirm={async () => {
                    try {
                        console.log(reservation.toISOString());
                        console.log(exit.toISOString());
                        await axiosPrivate.post("/reservation/" + selectedLocation.locationId, {
                            startDate: reservation.toISOString(),
                            endDate: exit.toISOString()
                        });
                        toast.success("Reservation successful!");
                        fetchLocations();
                    } catch (err: any) {
                        if (!err?.response) {
                            toast.error('No server response');
                        } else {
                            for (let i = 0; i < err.response.data.length; i++) {
                                toast.error(err.response.data[i].message);
                            }
                        }
                    } finally {
                        setDialogOpen(false);
                    }
                }}
                confirmText="Yes"
                cancelText="No" />
        </div>
    );
};

export default DashboardList;