'use client';

const SnackBar = ({ isOpen, title, onDismiss, type }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className='fixed bottom-2 right-2 z-1000 flex justify-end items-end p-2'>
            <div
                className='w-fit h-fit max-h-[50px] min-w-[300px] bg-grey50 rounded-lg p-2 flex flex-col relative border border-gray-200 shadow-md'
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-row items-center gap-2">
                    <div className='w-full h-fit flex flex-row items-center gap-2 justify-start'>
                        {type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>

                        ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>)}

                        <h1 className="text-sm gellix text-black">{title}</h1>
                    </div>
                    {/* close icon */}
                    <div className="hover:bg-gray-200 rounded-full p-1 cursor-pointer" onClick={onDismiss}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnackBar;