import { useEffect, useState } from "react";
import Dialog, { DialogBody, DialogFooter } from "../../../../components/dialog";
import InfoStep from "./infoStep";
import StepNavigator from "../../../../components/stepNavigator";
import ReservationStep from "./reservationStep";

interface LocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    location: {
        locationId: string;
        name: string;
        type: string;
        description: string;
        hourlyRate: number;
        minimumTime: number;
        maximumTime: number;
    } | null;
    onUpdate: () => void;
}

const DashboardDialog: React.FC<LocationDialogProps> = ({ isOpen, onClose, location, onUpdate }) => {
    const [step, setStep] = useState(0);
    const totalSteps = 3;

    useEffect(() => {
        if (isOpen) {
            setStep(0);
        }
    }, [isOpen]);

    const renderStepContent = () => {
        if (!location) return <p>No location found</p>;

        switch (step) {
            case 0:
                return <InfoStep location={location} onStep={setStep}/>;
            case 1:
                return <ReservationStep location={location} onStep={setStep}/>;
            case 2:
                return <div>teste</div>;
            default:
                return null;
        }
    };

    return (
        <Dialog isOpen={isOpen} title={location?.name} onClose={onClose} className="sm reservation">
            <DialogBody>
                {renderStepContent()}
            </DialogBody>
            <DialogFooter>
                <div className="stepBox">
                    <StepNavigator
                        currentStep={step}
                        totalSteps={totalSteps}
                        onStepChange={setStep}
                        nextStepAble={step < totalSteps - 1}
                        backStepAble={step > 0}
                    />
                </div>
            </DialogFooter>
        </Dialog>
    );
}

export default DashboardDialog;