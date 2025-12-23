const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold">{value}</h2>
      </div>
      <div className="text-3xl text-blue-600">{icon}</div>
    </div>
  );
};

export default StatsCard;
