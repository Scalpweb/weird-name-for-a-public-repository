import EndpointTester from "./EndpointTester";

function Jobs() {
  return (
    <>
      <EndpointTester
        title="Unpaid Jobs"
        getUrl={() => "/jobs/unpaid"}
        getBody={() => undefined}
        filters={[]}
        method="GET"
      />
      <EndpointTester
        title="Pay a contractor"
        getUrl={(values) => `/jobs/${values.id}/pay`}
        getBody={() => undefined}
        filters={[{ label: "Job Id", key: "id", type: "number" }]}
        method="POST"
      />
    </>
  );
}

export default Jobs;
