import EndpointTester from "./EndpointTester";

function Balances() {
  return (
    <EndpointTester
      title="Deposit on user balance"
      getUrl={(values) => `/balances/deposit/${values.userId}`}
      getBody={(values) => JSON.stringify({ amount: values.amount })}
      headers={{ "Content-Type": "application/json" }}
      filters={[
        { label: "Amount", key: "amount", type: "number" },
        { label: "User Id", key: "userId", type: "number" },
      ]}
      method="POST"
    />
  );
}

export default Balances;
