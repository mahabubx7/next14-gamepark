export default async function PaymentCancelled() {
  return (
    <div className="mx-auto mt-12 w-full max-w-screen-md bg-red-500/30 text-red-500 p-2 rounded">
      <h1 className="my-2 text-xl font-bold">Payment Cancelled</h1>
      <p>Your payment was cancelled. Please try again.</p>
    </div>
  );
}
