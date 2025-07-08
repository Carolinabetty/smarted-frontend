export const simulateMpesaPayment = async (amount, phoneNumber) => {
  if (!amount || !phoneNumber) {
    console.error("Missing amount or phoneNumber in simulateMpesaPayment");
    return { success: false };
  }

  console.log(`🔁 Simulating M-Pesa payment for ${phoneNumber}, amount: ${amount}`);
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ success: true, transaction_id: "SIMULATED_TX_001" });
    }, 1500)
  );
};
