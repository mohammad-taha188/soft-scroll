function Side({ children, customClass }) {
  return <div className={`snap-start h-screen ${customClass}`}>{children}</div>;
}

export default Side;
