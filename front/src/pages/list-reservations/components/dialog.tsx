import { useEffect, useState } from "react";
import Dialog, { DialogBody, DialogFooter } from "../../../components/dialog";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import { toast } from "react-toastify";

interface ReservationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: {
        reservationId: string;
        location: {
            locationId: string;
            name: string;
            description: string;
            hourlyRate: number;
            maximumTime: number;
            minimumTime: number;
            type: string;
        };
        user: {
            userId: string;
            name: string;
            email: string;
            cpf: string;
            phone: string;
        };
        finalValue: string;
        startDate: string;
        endDate: string;
        status: string;
    } | null;
    onUpdate: () => void;
}

const ListReservationsDialog: React.FC<ReservationDialogProps> = ({ isOpen, onClose, reservation, onUpdate }) => {
    const [reservationId, setReservationId] = useState<string>('');
    const [location, setLocation] = useState<{
        locationId: string;
        name: string;
        description: string;
        hourlyRate: number;
        maximumTime: number;
        minimumTime: number;
        type: string;
    } | null>(null);
    const [user, setUser] = useState<{
        userId: string;
        name: string;
        email: string;
        cpf: string;
        phone: string;
    } | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [finalValue, setFinalValue] = useState<string>('');
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (reservation) {
            setReservationId(reservation.reservationId || '');
            setLocation(reservation.location || null);
            setUser(reservation.user || null);
            setStartDate(reservation.startDate || '');
            setEndDate(reservation.endDate || '');
            setStatus(reservation.status || '');
            setFinalValue(reservation.finalValue || '');
        }
    }, [reservation]);

    const calculateHoursDifference = (start: string, end: string): number => {
        const startDateTime = new Date(start);
        const endDateTime = new Date(end);

        const diffMs = endDateTime.getTime() - startDateTime.getTime();

        const diffHours = diffMs / (1000 * 60 * 60);

        return Math.abs(diffHours);
    };

    const calculateFinalValue = (start: string, end: string) => {
        if (location) {
            const diffInHours = calculateHoursDifference(start, end);
            const finalValue = location.hourlyRate * diffInHours;
            setFinalValue((location.hourlyRate * diffInHours).toFixed(2));
        } else {
            setFinalValue('0.00');
        }
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        if (endDate) {
            calculateFinalValue(newStartDate, endDate);
        }
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        if (startDate) {
            calculateFinalValue(startDate, newEndDate);
        }
    }

    const updateReservation = async () => {
        try {
            await axiosPrivate.put(`/reservation/${reservationId}`,
                {

                    "userId": user?.userId,
                    "locationId": location?.locationId,
                    "startDate": startDate,
                    "endDate": endDate,
                    "finalValue": finalValue,
                    "status": status

                });
            toast.success('User updated successfully!');
            onClose();
            onUpdate();
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

    const removeReservation = async () => {
        try {
            await axiosPrivate.delete(`/reservation/${reservationId}`);
            toast.success('Reservation deleted successfully!');
            onClose();
            onUpdate();
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

    return (
        <Dialog isOpen={isOpen} title="Reservations Datails" onClose={onClose} className="md">
            <DialogBody>
                <div className="user-data">
                    <h2>User Infos</h2>
                    <div className="user-data-content">
                        <div className="form-group input-label">
                            <label htmlFor="name">Name: </label>
                            <input
                                type="text"
                                id="userId"
                                value={user?.name || ''}
                                max={50}
                                disabled
                                className={invalidFields.name ? "input-error" : ""}
                            />
                        </div>
                        <div className="form-group input-label">
                            <label htmlFor="cpf">CPF: </label>
                            <input
                                type="text"
                                id="cpf"
                                value={user?.cpf || ''}
                                max={50}
                                disabled
                                className={invalidFields.cpf ? "input-error" : ""}
                            />
                        </div>
                        <div className="form-group input-label">
                            <label htmlFor="phone">Phone: </label>
                            <input
                                type="text"
                                id="phone"
                                value={user?.phone || ''}
                                max={50}
                                disabled
                                className={invalidFields.phone ? "input-error" : ""}
                            />
                        </div>
                        <div className="form-group input-label">
                            <label htmlFor="email">Email: </label>
                            <input
                                type="text"
                                id="email"
                                value={user?.email || ''}
                                max={50}
                                disabled
                                className={invalidFields.email ? "input-error" : ""}
                            />
                        </div>
                    </div>
                </div>
                <div className="check-data">
                    <h2>Reservation Datails</h2>
                    <div className="check-data-content">
                        <div className="date">
                            <div className="form-group input-label">
                                <label htmlFor="startDate">Start Date: </label>
                                <input
                                    type="datetime-local"
                                    id="reservation-time"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => { handleStartDateChange(e) }}
                                />
                            </div>
                            <div className="form-group input-label">
                                <label htmlFor="endDate">End Date: </label>
                                <input
                                    type="datetime-local"
                                    id="reservation-time"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => { handleEndDateChange(e) }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="form-group input-label">
                                <label htmlFor="status">Status: </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CHECKED-IN">Checked-in</option>
                                    <option value="CHECKED-OUT">Checked-out</option>
                                </select>
                            </div>
                            <p>
                                Final Value: R$ {finalValue}
                            </p>
                        </div>
                    </div>
                </div>

            </DialogBody>
            <DialogFooter>
                <div className="flex between">
                    <button className="btn danger" onClick={removeReservation}>
                        Delete
                    </button>
                    <button className="btn" onClick={updateReservation}>
                        Save
                    </button>
                </div>
            </DialogFooter>
        </Dialog>
    );
}

export default ListReservationsDialog;