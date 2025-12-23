const Footer = () => {
  return (
    <footer className="h-10 bg-slate-900 text-slate-400 text-xs flex items-center justify-center">
      © {new Date().getFullYear()} SMS Dashboard
    </footer>
  );
};

export default Footer;
