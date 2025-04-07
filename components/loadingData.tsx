import React from 'react';
import "../app/globals.css";

const LoadingData: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full h-full'>
            <div style={styles.spinner} className='animate-spin'></div>
            <p className='pt-6 worksans-semibold'>Wait a little bit while we find the best data for you...</p>
        </div>
    );
};

const styles = {
    spinner: {
        width: '30px',
        height: '30px',
        border: '3px solid #ccc',
        borderTop: '3px solid #0D0DFC',
        borderRadius: '50%',
    },
};

export default LoadingData;