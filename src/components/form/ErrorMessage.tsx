interface ErrorMessageProps {
    message: string;
  }
  
  const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return <p className="text-xs text-destructive mt-1">{message}</p>;
  };
  
  export default ErrorMessage;
  