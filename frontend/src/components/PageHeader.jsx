const PageHeader = ({ title, description }) => {
  return (
    <div className="page-header">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export default PageHeader;