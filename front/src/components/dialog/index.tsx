import React from "react";
import "./index.scss";

interface DialogProps {
    isOpen: boolean;
    title?: string;
    className?: string;
    onClose: () => void;
    children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, title, className, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className={className ? `dialog ${className}` : "dialog"}
                 onClick={(e) => e.stopPropagation()}>
                {title && (
                    <div className="dialog-header">
                        <h3>{title}</h3>
                        <button className="close" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export const DialogBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="dialog-content">
            {children}
        </div>
    );
};

export const DialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="dialog-footer">
            {children}
        </div>
    );
};

export default Dialog;