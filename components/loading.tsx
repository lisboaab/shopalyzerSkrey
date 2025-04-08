import React from 'react';
import "../app/globals.css";

const Loading: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center h-120vh'>
            <div style={styles.spinner} className='animate-spin'></div>
            <p className='pt-6 worksans-semibold'>Hang on... I'm thinking...</p>
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

export default Loading;