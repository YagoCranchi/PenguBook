import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import validateForm from "./formValidator";

const LocationForm = () => {
    const [name, setName] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [hourlyRate, setHourlyRate] = useState<string>("0");
    const [minimumTime, setMinimumTime] = useState<string>("0");
    const [maximumTime, setMaximumTime] = useState<string>("0");
    
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const axiosPrivate = useAxiosPrivate();

    const handleLocationForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors, invalidFields } = validateForm(name);

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }

        try {
            await axiosPrivate.post('/user/create',
                {
                    name
                }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            toast.success('Location created successfully!');
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

    return (
        <form onSubmit={handleLocationForm} className="location-form">
            <div className="form-group input-label">
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
            <div className="form-group input-label">
                <label htmlFor="name">Type: </label>

                <select
                    id="role"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={invalidFields.role ? "input-error" : ""}
                    disabled
                >
                    <option value="ADMIN">Admin</option>
                    <option value="BASIC">User</option>
                </select>

                {/* <input
                    type="text"
                    id="type"
                    value={type}
                    max={50}
                    onChange={(e) => setType(e.target.value)}
                    className={invalidFields.name ? "input-error" : ""}
                /> */}
            </div>
            <div className="form-group input-label">
                <label htmlFor="name">Description: </label>
                <input
                    type="text"
                    id="name"
                    value={description}
                    max={50}
                    onChange={(e) => setDescription(e.target.value)}
                    className={invalidFields.name ? "input-error" : ""}
                />
            </div>
            <div className="form-group input-label">
                <label htmlFor="name">Hourly Rate:</label>
                <div className="box">
                    <span>
                        $
                    </span>
                    <input
                        type="number"
                        id="name"
                        value={hourlyRate}
                        max={50}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className={invalidFields.name ? "input-error" : ""}
                    />
                </div>
            </div>
            <div className="form-group input-label">
                <label htmlFor="name">
                    Minimum Time:
                    <span>
                        (in minutes)
                    </span>
                </label>
                <input
                    type="number"
                    id="name"
                    value={minimumTime}
                    max={50}
                    onChange={(e) => setMinimumTime(e.target.value)}
                    className={invalidFields.name ? "input-error" : ""}
                />
            </div>
            <div className="form-group input-label">
                <label htmlFor="name">
                    Maximum Time:
                    <span>
                        (in minutes)
                    </span>
                </label>
                <input
                    type="number"
                    id="name"
                    value={maximumTime}
                    max={50}
                    onChange={(e) => setMaximumTime(e.target.value)}
                    className={invalidFields.name ? "input-error" : ""}
                />
            </div>
            <div className="btn-box">
                <button type="submit" className="btn signup-button">Create</button>
            </div>
        </form>
    );
}

export default LocationForm;