import TransferFailed from "../../../components/TransferFailed";

export default function TransferFailedPage({
  searchParams,
}: {
  searchParams: { amount?: string; reason?: string };
}) {
  const amount = Number(searchParams.amount);

  return (
    <TransferFailed
      amount={Number.isFinite(amount) ? amount : 0}
      reason={searchParams.reason}
    />
  );
}