import React from 'react';

function Loader() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );
}

export default Loader;
