import EndpointTester from "./EndpointTester";

function Contracts() {
  return (
    <>
      <EndpointTester
        title="List contracts"
        getUrl={() => "/contracts"}
        getBody={() => undefined}
        filters={[]}
        method="GET"
      />
      <EndpointTester
        title="Get contract"
        getUrl={(values) => `/contracts/${values.id}`}
        getBody={() => undefined}
        filters={[{ label: "Contract Id", key: "id", type: "number" }]}
        method="GET"
      />
    </>
  );
}

export default Contracts;
