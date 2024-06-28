const StaggeredDotsAnimation = () => {
  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-50%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(50%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-custom {
          animation: bounce 1s infinite;
        }
        .dot-1 { --delay: 0s; }
        .dot-2 { --delay: 0.2s; }
        .dot-3 { --delay: 0.4s; }
      `}</style>
      <div className="flex items-center space-x-1">
        <span
          className="dot-1 h-1 w-1 rounded-full bg-gray-400 animate-bounce-custom"
          style={{ animationDelay: 'var(--delay)' }}
        />
        <span
          className="dot-2 h-1 w-1 rounded-full bg-gray-400 animate-bounce-custom"
          style={{ animationDelay: 'var(--delay)' }}
        />
        <span
          className="dot-3 h-1 w-1 rounded-full bg-gray-400 animate-bounce-custom"
          style={{ animationDelay: 'var(--delay)' }}
        />
      </div>
    </>
  );
};

export default StaggeredDotsAnimation;
