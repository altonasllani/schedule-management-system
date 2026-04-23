const Navbar = () => {
  return (
    <header className="legacy-navbar">
      <h1 className="legacy-navbar-title">Schedule Management System</h1>

      <div className="legacy-navbar-user">
        <span className="legacy-navbar-role">Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          className="legacy-navbar-avatar"
          alt="avatar"
        />
      </div>
    </header>
  );
};

export default Navbar;
