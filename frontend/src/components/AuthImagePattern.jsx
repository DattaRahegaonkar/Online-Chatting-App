const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center p-12"
      style={{ backgroundColor: "#2b2d31" }}>
      <div className="max-w-sm text-center">

        {/* Animated grid */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl ${i % 2 === 0 ? "animate-pulse" : ""}`}
              style={{ backgroundColor: i % 2 === 0 ? "#5865f2" : "#404249", opacity: i % 2 === 0 ? 0.7 : 0.4 }}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#b5bac1" }}>{subtitle}</p>
      </div>
    </div>
  );
};
export default AuthImagePattern;
