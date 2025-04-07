import React from "react";

import "./index.scss";

interface DialogProps {
    isOpen: boolean;
    title?: string;
    content?: string | React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancelButton?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    title,
    content = "Dialog Content",
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    showCancelButton = true,
}) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-container">
                {title && (
                    <div className="dialog-header">
                        <h3>{title}</h3>
                        <button className="btn dialog-close" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                )}
                <div className="dialog-content">{content}</div>
                <div className="dialog-actions">
                    {showCancelButton && (
                        <button className="btn dialog-button cancel" onClick={onClose}>
                            {cancelText}
                        </button>
                    )}
                    {onConfirm && (
                        <button className="btn dialog-button confirm" onClick={onConfirm}>
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dialog;