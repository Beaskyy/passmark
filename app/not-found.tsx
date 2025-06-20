import EmptyState from "@/components/empty-state";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <EmptyState
        image="/images/corrupt-file.svg"
        title="Page Not Found"
        desc="Sorry, the page you are looking for does not exist or has been moved."
        link="/"
        buttonText="Back to home"
        showIcon={false}
      />
    </div>
  );
};

export default NotFound;
