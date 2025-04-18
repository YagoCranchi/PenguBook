import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ReservationStepProps {
    location: {
        locationId: string;
        hourlyRate: number;
        minimumTime: number;
        maximumTime: number;
    };
    onStep: (steps: number) => void;
}

const ReservationStep: React.FC<ReservationStepProps> = ({ location, onStep }) => {
    const [reservation, setReservation] = useState(new Date());
    const [reservationSelected, setReservationSelected] = useState(false);
    const [exit, setExit] = useState(new Date());
    const [exitSelected, setExitSelected] = useState(false);

    const handleEntrance = (e: any) => {
        const newReservation = new Date(e.target.value);
        if (!isNaN(newReservation.getTime())) {
            setReservation(newReservation);
            const exitTimeInput = document.getElementById("exit-time") as HTMLInputElement;
            if (exitTimeInput) {
                exitTimeInput.value = e.target.value;
            }
            setReservationSelected(true);
        }
    }

    useEffect(() => {
        if (reservationSelected) {
            const differenceInMinutes = (exit.getTime() - reservation.getTime()) / (1000 * 60);

            if (differenceInMinutes < location.minimumTime) {
                toast.error(`The reservation must be at least ${location.minimumTime} minutes`);
                setExitSelected(false);
                return;
            }

            if (differenceInMinutes > location.maximumTime) {
                toast.error(`The reservation cannot exceed ${location.maximumTime} minutes (${location.maximumTime / 60} hours)`);
                setExitSelected(false);
                return;
            }

            setExitSelected(true);
        }
    }, [exit]);



    return (
        <div className="reservation-step">

            <div className="desc">
                <p><span>Minimum Time:</span> {location.minimumTime} hours</p>
                <p><span>Maximum Time:</span> {location.maximumTime} hours</p>
            </div>
            <div className="form-group input-label">
                <label htmlFor="reservation-time">
                    Select the date/time of entry:
                </label>
                <input
                    type="datetime-local"
                    id="reservation-time"
                    className="form-control"
                    onBlur={handleEntrance}
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
                    disabled={!reservationSelected}
                    onBlur={(e) => setExit(new Date(e.target.value))}
                />
            </div>

            <div>
                <p className="desc">Hourly Rate: R$ {location.hourlyRate}</p>
                {exitSelected && (
                    <p className="desc">Total Value: R$ {(location.hourlyRate * (exit.getTime() - reservation.getTime()) / (1000 * 60 * 60)).toFixed(2)}</p>
                )}
            </div>

            <div className="box-btn">
                <button
                    className="btn danger"
                    onClick={() => onStep(0)}
                >
                    Back to Info
                </button>
                <button
                    className="btn"
                    disabled={!exitSelected}
                    onClick={() => onStep(2)}
                >
                    Next Step
                </button>
            </div>
        </div>
    );
}
export default ReservationStep;