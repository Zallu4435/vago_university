import React from 'react';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return <p className='text-red-500 text-sm mt-1'>{ message }</p>
}

export default ErrorMessage;
