import type React from "react";

function ErrorNotFoundPage(): React.ReactNode {
  return (
    <div className="error-page">
      <h1>Resource Not Found.</h1>
      <p>Resource you are looking for is not present.</p>
    </div>
  );
};

export default ErrorNotFoundPage;