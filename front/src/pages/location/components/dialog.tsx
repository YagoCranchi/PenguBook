import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/axiosPrivate";

import Dialog, { DialogBody, DialogFooter } from "../../../components/dialog";
import validateForm from "./dialogValidator";
import { toast } from "react-toastify";

interface LocationsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    location: {
        locationId: string;
        name: string;
        type: string;
        description: string,
        hourlyRate: number,
        minimumTime: number,
        maximumTime: number,
    } | null;
    onUpdate: () => void;
}

const LocationDialog: React.FC<LocationsDialogProps> = ({ isOpen, onClose, location, onUpdate }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState(0);
    const [minimumTime, setMinimumTime] = useState(0);
    const [maximumTime, setMaximumTime] = useState(0);
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        resetInputs();
        if (location && location.locationId) {
            setName(location.name || '');
            setType(location.type || '');
            setDescription(location.description || '');
            setHourlyRate(location.hourlyRate || 0);
            setMinimumTime(location.minimumTime || 0);
            setMaximumTime(location.maximumTime || 0);
        }
    }, [location]);

    const resetInputs = () => {
        setName('');
        setType('');
        setDescription('');
        setHourlyRate(0);
        setMinimumTime(0);
        setMaximumTime(0);
        setInvalidFields({});
    }

    const updateLocation = async () => {
        setInvalidFields({});
        const { isValid, errors, invalidFields } = validateForm(name, type,
            description, hourlyRate, minimumTime, maximumTime);

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }

        if(location?.locationId) {
            try {
                await axiosPrivate.put(`/location/${location?.locationId}`,
                    {
                        name,
                        type,
                        description,
                        hourlyRate,
                        minimumTime,
                        maximumTime
                    });
                toast.success('Location updated successfully!');
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
                await axiosPrivate.post(`/location/create`,
                    {
                        name,
                        type,
                        description,
                        hourlyRate,
                        minimumTime,
                        maximumTime
                    });
                toast.success('Location created successfully!');
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

    const deleteLocation = async () => {
        try {
            await axiosPrivate.delete(`/location/${location?.locationId}`);
            toast.success('Location deleted successfully!');
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
        <Dialog isOpen={isOpen} title="Location Datails" onClose={onClose} className="md">
            <DialogBody>
                <div className="datails">
                    <div className="form-group input-label name">
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            max={50}
                            onChange={(e) => setName(e.target.value)}
                            className={invalidFields.name ? "input-error" : ""}
                        />
                    </div>
                    <div className="form-group input-label type">
                        <label htmlFor="type">Type: </label>
                        <input
                            type="text"
                            id="type"
                            value={type}
                            max={50}
                            onChange={(e) => setType(e.target.value)}
                            className={invalidFields.type ? "input-error" : ""}
                        />
                    </div>
                </div>
                <div className="form-group input-label">
                    <label htmlFor="description">Description: </label>
                    <textarea
                        maxLength={250}
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={invalidFields.description ? "input-error" : ""}
                    />
                </div>
                <div className="form-group input-label">
                    <label htmlFor="hourlyRate">Hourly Rate: </label>
                    <div className="box">
                        <span className="currency">$</span>
                        <input
                            type="number"
                            id="hourlyRate"
                            value={(hourlyRate).toFixed(2)}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className={invalidFields.hourlyRate ? "input-error" : ""}
                        />
                    </div>
                </div>
                <div className="time">
                    <div className="form-group input-label">
                        <label htmlFor="minimumTime">
                            Minimum Time:
                            <span>
                                in secounds
                            </span>
                        </label>
                        <input
                            type="number"
                            id="minimumTime"
                            value={minimumTime}
                            onChange={(e) => setMinimumTime(Number(e.target.value))}
                            className={invalidFields.minimumTime ? "input-error" : ""}
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
                            type="number"
                            id="maximumTime"
                            value={maximumTime}
                            onChange={(e) => setMaximumTime(Number(e.target.value))}
                            className={invalidFields.maximumTime ? "input-error" : ""}
                        />
                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                <div className="flex between footer">
                    <button className="btn" onClick={updateLocation}>
                        Save
                    </button>
                    {location?.locationId && (
                        <button className="btn danger" onClick={deleteLocation}>
                            Delete
                        </button>
                    )}
                </div>
            </DialogFooter>
        </Dialog>
    );
}

export default LocationDialog;