import React from "react";
import { mdiArrowLeftThick, mdiArrowRightThick } from '@mdi/js';
import Icon from '@mdi/react';

import "./index.scss";

interface StepNavigatorProps {
    currentStep: number;
    totalSteps: number;
    onStepChange: (step: number) => void;
    showArrows?: boolean;
    nextStepAble?: boolean;
    backStepAble?: boolean;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({ currentStep, totalSteps, onStepChange, showArrows, nextStepAble, backStepAble }) => {
    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            onStepChange(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            onStepChange(currentStep - 1);
        }
    };

    return (
        <div className="step-navigator">
            {showArrows && (
                <button
                    className="btn"
                    onClick={handleBack}
                    disabled={currentStep === 0 || !backStepAble}
                >
                    <Icon path={mdiArrowLeftThick} size={1} color="currentColor" />
                </button>
            )}
            <div className="steps">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <span
                        key={index}
                        className={`step ${index === currentStep ? "active" : ""}`}
                    />
                ))}
            </div>
            {showArrows && (
                <button
                    className="btn"
                    onClick={handleNext}
                    disabled={currentStep === totalSteps - 1 || !nextStepAble}
                >
                    <Icon path={mdiArrowRightThick} size={1} color="currentColor" />
                </button>
            )}
        </div>
    );
};

export default StepNavigator;