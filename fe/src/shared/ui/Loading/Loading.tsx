const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-500/80 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loading;
