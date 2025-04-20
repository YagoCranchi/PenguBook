import { useEffect, useState } from "react";
import Dialog, { DialogBody, DialogFooter } from "../../../components/dialog";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import { toast } from "react-toastify";
import validateForm from "./dialogValidator";

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
    const [allLocations, setAllLocations] = useState<Array<{
        locationId: string;
        name: string;
        description: string;
        hourlyRate: number;
        maximumTime: number;
        minimumTime: number;
        type: string;
    }>>([]);
    const [user, setUser] = useState<{
        userId: string;
        name: string;
        email: string;
        cpf: string;
        phone: string;
    } | null>(null);
    const [allUsers, setAllUsers] = useState<Array<{
        userId: string;
        name: string;
        email: string;
        cpf: string;
        phone: string;
    }>>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [finalValue, setFinalValue] = useState<string>('');
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        resetInputs();
        if (reservation && reservation.reservationId) {
            setReservationId(reservation.reservationId || '');
            setLocation(reservation.location || null);
            setUser(reservation.user || null);
            setStartDate(reservation.startDate || '');
            setEndDate(reservation.endDate || '');
            setStatus(reservation.status || 'PENDING');
            setFinalValue(reservation.finalValue || '');
            setInvalidFields({});
        }

        const fetchUsers = async () => {
            try {
                const response = await axiosPrivate.get('/user/all');
                setAllUsers(response.data);
            } catch (err: any) {
                console.error("User fetch Error:", err);
                toast.error("Error fetching users");
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axiosPrivate.get('/location/all');
                setAllLocations(response.data);
            } catch (err: any) {
                console.error("User fetch Error:", err);
                toast.error("Error fetching users");
            }
        };

        fetchUsers();
        fetchLocations();
    }, [reservation]);

    const resetInputs = () => {
        setReservationId('');
        setLocation(null);
        setAllLocations([]);
        setUser(null);
        setAllUsers([]);
        setStartDate('');
        setEndDate('');
        setStatus('PENDING');
        setFinalValue('0.00');
        setInvalidFields({});
    }

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
            setFinalValue((location.hourlyRate * diffInHours).toFixed(2));
        } else {
            setFinalValue('0.00');
        }
    }

    useEffect(() => {
        calculateFinalValue(startDate, endDate);
    }, [startDate, endDate, location]);

    const updateReservation = async () => {
        setInvalidFields({});
        const { isValid, errors, invalidFields } = validateForm(
            user?.userId || '',
            location?.locationId || '',
            startDate,
            endDate,
            status
        );

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }

        if (reservationId) {
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
        } else {
            try {
                await axiosPrivate.post('/reservation/create', {
                    "userId": user?.userId,
                    "locationId": location?.locationId,
                    "startDate": startDate,
                    "endDate": endDate,
                    "status": status
                });
                toast.success('User created successfully!');
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
                <div className="location-data">
                    <h2>Location Infos</h2>
                    <div className="location-data-content">
                        <div className="infos">
                            <div className="form-group input-label">
                                <label htmlFor="locationName">Name: </label>
                                <select
                                    id="locationName"
                                    value={location?.locationId || ''}
                                    onChange={(e) => {
                                        const selectedLocation = allLocations.find(u => u.locationId === e.target.value);
                                        setLocation(selectedLocation || null);
                                    }}
                                    className={invalidFields.locationId ? "input-error" : ""}
                                >
                                    <option value="" disabled>
                                        Select a location
                                    </option>
                                    {allLocations.map(location => (
                                        <option key={location.locationId} value={location.locationId}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group input-label">
                                <label htmlFor="hourlyRate">Hourly Rate: </label>
                                <div className="box">
                                    <span className="currency">$</span>
                                    <input
                                        type="text"
                                        id="hourlyRate"
                                        value={location?.hourlyRate || ''}
                                        max={50}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group input-label">
                            <label htmlFor="description">Description: </label>
                            <textarea
                                maxLength={250}
                                id="description"
                                value={location?.description || ''}
                                disabled
                            />
                        </div>
                        <div className="time">
                            <div className="form-group input-label">
                                <label htmlFor="minimumTime">
                                    Minimum Time:
                                    <span>
                                        in minutes
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="maximumTime"
                                    value={location?.maximumTime || ''}
                                    max={50}
                                    disabled
                                />
                            </div>
                            <div className="form-group input-label">
                                <label htmlFor="maximumTime">
                                    Maximum Time:
                                    <span>
                                        in secounds
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="minimumTime"
                                    value={location?.minimumTime || ''}
                                    max={50}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-data">
                    <h2>User Infos</h2>
                    <div className="user-data-content">
                        <div className="form-group input-label">
                            <label htmlFor="userName">Name: </label>
                            <select
                                id="userName"
                                value={user?.userId || ''}
                                onChange={(e) => {
                                    const selectedUser = allUsers.find(u => u.userId === e.target.value);
                                    setUser(selectedUser || null);
                                }}
                                className={invalidFields.userId ? "input-error" : ""}
                            >
                                <option value="" disabled>
                                    Select a user
                                </option>
                                {allUsers.map(user => (
                                    <option key={user.userId} value={user.userId}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group input-label">
                            <label htmlFor="cpf">CPF: </label>
                            <input
                                type="text"
                                id="cpf"
                                value={user?.cpf || ''}
                                max={50}
                                disabled
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
                                    value={startDate}
                                    onChange={(e) => { setStartDate(e.target.value); }}
                                    className={invalidFields.startDate ? "input-error" : ""}
                                />
                            </div>
                            <div className="form-group input-label">
                                <label htmlFor="endDate">End Date: </label>
                                <input
                                    type="datetime-local"
                                    id="reservation-time"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); }}
                                    className={invalidFields.endDate ? "input-error" : ""}
                                />
                            </div>
                            <div className="form-group input-label status">
                                <label htmlFor="status">Status: </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className={invalidFields.status ? "input-error" : ""}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CHECKED-IN">Checked-in</option>
                                    <option value="CHECKED-OUT">Checked-out</option>
                                </select>
                            </div>
                        </div>
                        <div className="finalValue">
                            <span>
                                Final Value: ${finalValue}
                            </span>
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