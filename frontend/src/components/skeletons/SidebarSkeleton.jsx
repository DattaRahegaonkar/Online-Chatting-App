const SidebarSkeleton = () => {
  const items = Array(8).fill(null);

  return (
    <aside className="h-full flex flex-col w-60 shrink-0" style={{ backgroundColor: "#2b2d31" }}>

      <div className="h-12 flex items-center px-4 border-b" style={{ borderColor: "#1e1f22" }}>
        <div className="h-4 w-32 rounded animate-pulse" style={{ backgroundColor: "#3f4147" }} />
      </div>

      <div className="px-2 pt-3 pb-1">
        <div className="h-7 rounded animate-pulse" style={{ backgroundColor: "#1e1f22" }} />
      </div>

      <div className="px-4 py-2">
        <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: "#3f4147" }} />
      </div>

      <div className="overflow-y-auto flex-1 px-2 space-y-1">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded">
            <div className="w-8 h-8 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: "#3f4147" }} />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: "#3f4147" }} />
              <div className="h-2.5 w-12 rounded animate-pulse" style={{ backgroundColor: "#3f4147" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="h-14 flex items-center px-2 gap-2 shrink-0"
        style={{ backgroundColor: "#232428", borderTop: "1px solid #1e1f22" }}>
        <div className="w-8 h-8 rounded-full animate-pulse shrink-0" style={{ backgroundColor: "#3f4147" }} />
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded animate-pulse" style={{ backgroundColor: "#3f4147" }} />
          <div className="h-2.5 w-12 rounded animate-pulse" style={{ backgroundColor: "#3f4147" }} />
        </div>
      </div>
    </aside>
  );
};
export default SidebarSkeleton;
