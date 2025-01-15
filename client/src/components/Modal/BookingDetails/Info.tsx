function BookingInfo({
  label,
  value,
}: {
  label: string;
  value: string | JSX.Element;
}) {
  return (
    <div className="grid grid-cols-1 text-sm">
      <strong>{label}</strong> {value}
    </div>
  );
}
export default BookingInfo;
