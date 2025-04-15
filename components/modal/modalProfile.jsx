'use client';

const ModalProfile = ({ isOpen, title, onDismiss, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className='fixed inset-0 w-screen h-screen bg-black/60 z-500 flex justify-center items-center'
            onClick={onDismiss}
        >
            <div
                className='w-200 h-fit min-h-[200px] bg-white rounded-xl p-2 flex flex-col relative border border-gray-200 shadow-md'
                onClick={(event) => event.stopPropagation()}
            >

                <div className='w-full h-fit flex flex-row items-center justify-between mb-1 p-4 gap-8'>
                    <h1 className="text-xl gellix-semibold text-black">{title}</h1>
                    {/* close icon */}
                    <div className="hover:bg-gray-200 rounded-full p-1 cursor-pointer" onClick={onDismiss}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div className="pl-5 pr-5 pb-5 gellix w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalProfile;