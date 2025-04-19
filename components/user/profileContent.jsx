// ProfileContent.jsx
import React from "react";
import Image from "next/image";
import bcrypt from "bcryptjs";
import ButtonAnimation from "../buttonAnimation";
import EditableField from "./editableField.jsx";

const ProfileContent = ({ user, onUpdateUser, onNotification }) => {
  const { name, email, profilePicture: profilePhoto, password: hashPassword } = user;
  
  const handleNameUpdate = async (newName) => {
    if (!newName) {
      onNotification("failure", "Name is required!");
      return;
    }
    
    try {
      await onUpdateUser({ name: newName });
      onNotification("success", "Name updated successfully!");
    } catch (error) {
      onNotification("failure", "Something went wrong, try again!");
    }
  };
  
  const handleEmailUpdate = async (newEmail) => {
    try {
      await onUpdateUser({ email: newEmail });
      onNotification("success", "Email updated successfully!");
    } catch (error) {
      onNotification("failure", "That email address is already in use.");
    }
  };
  
  const handlePasswordUpdate = async (currentPassword, newPassword) => {
    if (!currentPassword) {
      onNotification("failure", "Current password is required!");
      return;
    }
    
    const check = bcrypt.compareSync(currentPassword, hashPassword);
    if (!check) {
      onNotification("failurePassword", "Current password is incorrect!");
      return;
    }
    
    if (!newPassword) {
      onNotification("failure", "New password is required!");
      return;
    }
    
    if (newPassword === currentPassword) {
      onNotification("failure", "New password must be different!");
      return;
    }
    
    try {
      await onUpdateUser({ password: newPassword });
      onNotification("success", "Password updated successfully!");
    } catch (error) {
      onNotification("failure", "Error updating password!");
    }
  };
  
  const editUserPhoto = () => {
    console.log("edit user photo");
    // Implementar lógica para editar foto de perfil
  };

  return (
    <div className="flex flex-row items-center justify-between">
      {/* profile picture */}
      <div className="flex flex-col w-1/2 gap-4 items-center">
        <div className="flex flex-row justify-center items-center size-45 rounded-full bg-linear-55 from-blue-600 from-20% to-blue-50">
        <div className="rounded-ful flex items-center justify-center h-42 w-42 cursor-pointer">
          <img
            src={profilePhoto}
            alt="Your profile picture"
            className="rounded-full w-contain h-contain"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        </div>
        </div>
        <ButtonAnimation
          icon="pencil"
          style="outline"
          color="#414653"
          label="Edit"
          width="9em"
          action={editUserPhoto}
        />
      </div>

      {/* user information */}
      <div className="flex flex-col w-1/2 items-center justify-center gap-4">
        <EditableField 
          label="Name" 
          value={name} 
          onSave={(newName) => handleNameUpdate(newName)} 
        />
        
        <EditableField 
          label="Email" 
          value={email} 
          onSave={(newEmail) => handleEmailUpdate(newEmail)} 
        />
        
        <EditableField 
          label="Password" 
          value="" 
          inputType="password" 
          placeholder="Current password"
          secondInput={{ 
            placeholder: "New password" 
          }}
          onSave={(currentPassword, newPassword) => handlePasswordUpdate(currentPassword, newPassword)} 
        />
      </div>
    </div>
  );
};

export default ProfileContent;