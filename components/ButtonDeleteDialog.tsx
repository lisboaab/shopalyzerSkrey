"use client";
import React from "react";
import "../app/globals.css";
import { useState } from "react";
import ModalDelete from "./modal/modalDelete";
import ButtonAnimation from "./buttonAnimation";

const ButtonDeleteDialog: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  // add interface with type for the props where the coder can pass the type of info to be 	deleted
	// also to pass the data to be deleted, or just the ID
	// if we have the tipe of data and the ID, then we can delete the data from the database

	// interface ButtonDeleteDialogProps {
	//   data: any;
	//   type: 'search'| 'user' | 'store' | 'metricsGroup' | 'metric'; 
	// }

  const modalHandler = () => {
    setShowModal((curr) => !curr);
  };

  return (
    <div>
      {/* trashcan SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-5 cursor-pointer z-200"
        onClick={modalHandler}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>

      <ModalDelete
        isOpen={showModal}
        onDismiss={modalHandler}
        title="Are you sure you want to delete this?"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          <h1 className="text-black">
            This action can not be undone and you will loose this information
            forever!
          </h1>

          <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-5">
            <ButtonAnimation
              label="Cancel"
              color="gray"
              action={modalHandler}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Delete"
              color="white"
              backgroundColor="red"
              icon="trashcan"
              action={modalHandler}
              width="10em"
            />
          </div>
        </div>
      </ModalDelete>
    </div>
  );
};

export default ButtonDeleteDialog;
