const MessageSkeleton = () => {
  const items = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
      {items.map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          {i % 3 !== 2 ? (
            <div className="skeleton w-10 h-10 rounded-full shrink-0" />
          ) : (
            <div className="w-10 shrink-0" />
          )}
          <div className="flex-1 space-y-2 pt-1">
            {i % 3 !== 2 && (
              <div className="flex items-center gap-2">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-2.5 w-12 rounded" />
              </div>
            )}
            <div
              className="skeleton h-4 rounded"
              style={{ width: `${40 + (i * 17) % 40}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default MessageSkeleton;
