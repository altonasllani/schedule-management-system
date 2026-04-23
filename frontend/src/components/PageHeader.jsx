const PageHeader = ({ title, description }) => {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-subtitle">{description}</p>}
    </div>
  );
};

export default PageHeader;
