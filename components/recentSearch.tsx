import React from 'react';
import "../app/globals.css";

interface RecentSearchProps {
    action: () => void;
    label: string;
  }

const RecentSearch: React.FC<RecentSearchProps> = ({label, action}) => {
    return (
        <div className='flex flex-col items-center justify-center' onClick={action}>
            <p className='pt-6 gellix-regular'> {label} </p>
        </div>
    );
};

export default RecentSearch;