function Side({ children, customClass }) {
  return (
    <div className={`snap-start h-screen ${customClass}`}>
      <div>{children}</div>
    </div>
  );
}

export default Side;
