import Alert from "@/components/Alert";
import { ApiError } from "@/api/client/error";

interface ErrorMessageProps {
  error: Error;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  let title = "Unexpected error occurred";

  let retrying = true;

  if (error instanceof ApiError) {
    title = error.message;
    retrying = error.retryable;
  }

  return (
    <Alert type={retrying ? "Warning" : "Danger"} title={title}>
      {retrying && "Hold tight I'm retrying automatically..."}
    </Alert>
  );
}
