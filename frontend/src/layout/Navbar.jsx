const Navbar = () => {
  return (
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Schedule Management System</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm">Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full w-8 h-8"
          alt="avatar"
        />
      </div>
    </header>
  );
};

export default Navbar;
