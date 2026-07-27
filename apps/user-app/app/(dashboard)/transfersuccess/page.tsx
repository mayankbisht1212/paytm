import TransferSuccess from "../../../components/TransferSuccess"
export default function transfersuccess({
  searchParams,
}: {
  searchParams: { amount?: string };
}) {
  const amount = Number(searchParams.amount);
    return(
         <TransferSuccess amount={Number.isFinite(amount) ? amount : 0} />
    )
}