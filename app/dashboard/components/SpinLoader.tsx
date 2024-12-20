const SpinLoader = ({
  size,
  color,
  thickness,
}: {
  size: number;
  color: string;
  thickness: number;
}) => {
  return (
    <div
      style={{
        borderColor: `${color}`,
        borderTopColor: 'transparent',
        width: `${size}px`,
        borderWidth: thickness,
        aspectRatio: 1,
      }}
      className={`animate-spin rounded-full`}
    ></div>
  );
};
export default SpinLoader;
