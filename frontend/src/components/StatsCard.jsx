const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stats-card">
      <div>
        <p className="stats-card-title">{title}</p>
        <h2 className="stats-card-value">{value}</h2>
      </div>
      <div className="stats-card-icon">{icon}</div>
    </div>
  );
};

export default StatsCard;
