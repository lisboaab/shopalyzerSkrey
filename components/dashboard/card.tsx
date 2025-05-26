import React from "react";
import { useState } from "react";

interface CardProps {
  label: string;
  value: string;
  
}

const Card: React.FC<CardProps> = ({
  label,
  value
}) => {
  return (
    <div>
     <h1 className="main gellix text-4xl mb-2">{value}</h1> 
     <p className="gellix-semibold text-base">{label}</p>
    </div>
    )
};
export default Card;
