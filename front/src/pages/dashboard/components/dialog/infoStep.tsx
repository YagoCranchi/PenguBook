import { useEffect, useState } from "react";

interface InfoStepProps {
    location: {
        type: string;
        description: string;
        hourlyRate: number;
        minimumTime: number;
        maximumTime: number;
    };
    onStep: (steps: number) => void;
}

const InfoStep: React.FC<InfoStepProps> = ({ location, onStep }) => {
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState(0);
    const [minimumTime, setMinimumTime] = useState(0);
    const [maximumTime, setMaximumTime] = useState(0);

    useEffect(() => {
        if (location) {
            setType(location.type || '');
            setDescription(location.description || '');
            setHourlyRate(location.hourlyRate || 0);
            setMinimumTime(location.minimumTime || 0);
            setMaximumTime(location.maximumTime || 0);
        }
    }, [location]);

    return (
        <div className="info-step">
            <div>
                <p className="desc">{description}</p>
                <div className="details">
                    <p><span>Hourly Rate:</span> ${hourlyRate}</p>
                    <p><span>type:</span> {type}</p>
                    <p><span>Minimum Time:</span> {minimumTime} hours</p>
                    <p><span>Maximum Time:</span> {maximumTime} hours</p>
                </div>

                <div className="box-btn">
                    <button className="btn" onClick={onStep.bind(null, 1)}>
                        Make your reservation
                    </button>
                </div>
            </div>
        </div>
    );
}
export default InfoStep;