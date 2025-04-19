import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import useAxiosPrivate from "../../../hooks/axiosPrivate";

interface Reservation {
    reservationId: string;
    location: {
        locationId: string;
        name: string;
        type: string;
        description: string;
        hourlyRate: number;
        minimumTime: number;
        maximumTime: number;
        creationDate: string;
    };
    startDate: string;
    endDate: string;
    finalValue: number;
    status: string;
}
const ReservationsList = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axiosPrivate.get("/reservation/");
                setReservations(response.data);
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

        fetchReservations();
    }, [axiosPrivate]);

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US');
    };
    
    return (
        <>
            {reservations.length > 0 ? (
                <div className="reservations-list">
                    {reservations.map((reservation) => (
                        <div key={reservation.reservationId} className="reservation-card">
                            <h3 className="location-title">{reservation.location.name}</h3>
                            <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                                {reservation.status}
                            </span>
                            <div className="reservation-details">
                                <div className="reservation-date">
                                    <p>
                                        Check-in:
                                        <span>{formatDate(reservation.startDate)}</span>
                                    </p>
                                    <p>
                                        Check-out:
                                        <span>{formatDate(reservation.endDate)}</span>
                                    </p>
                                </div>

                                <div>
                                    <span>
                                        Total:
                                    </span>
                                    <span>
                                        ${reservation.finalValue.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-reservations">
                    <p>
                        No reservations found. Please check back later or make a new reservation.
                    </p>
                </div>
            )}
        </>
    );
}

export default ReservationsList;