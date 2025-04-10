import React from "react";

import "../index.scss";

interface DialogProps {
    isOpen: boolean;
    title?: string;
    className?: string;
    content?: string | React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancelButton?: boolean;
}

const DialogConfirm: React.FC<DialogProps> = ({
    isOpen,
    title,
    className,
    content = "",
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    showCancelButton = true,
}) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className={className ? `dialog ${className}` : "dialog"}>
                {title && (
                    <div className="dialog-header">
                        <h3>{title}</h3>
                        <button className="btn close" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                )}
                <div className="dialog-content">
                    {content}
                </div>
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

export default DialogConfirm;