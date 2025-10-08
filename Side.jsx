function Side({ children, customClass }) {
  return (
    <div
      className={`snap-start h-screen flex items-center justify-center bg-gradient-to-r text-4xl font-bold ${customClass}`}
    >
      <div>{children}</div>
    </div>
  );
}

export default Side;
