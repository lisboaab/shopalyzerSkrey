'use client';
import React from "react";

interface ModalUserMenuProps {
    onDismiss: () => void;
    isOpen: boolean;
    children: any;
    className?: string;
  }

const ModalUserMenu: React.FC<ModalUserMenuProps>= ({ isOpen, onDismiss, children, className }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={`fixed top-22 left-0 right-15 bottom-0 z-10000 flex justify-end items-top ${className}`}
            onClick={onDismiss}
        >
            <div
                className='min-w-[200px] w-fit h-fit min-h-[100px] bg-white rounded-xl flex flex-col relative border border-gray-200 shadow-md'
                onClick={(event) => event.stopPropagation()}
            >
                <div className="gellix max-w-xl">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalUserMenu;