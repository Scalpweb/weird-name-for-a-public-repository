import moment from "moment";
import EndpointTester from "./EndpointTester";

function Admin() {
  const getBestProfessionUrl = (filters) =>
    `/admin/best-profession?startDate=${moment(filters.startDate).format(
      "YYYY/MM/DD"
    )}&endDate=${moment(filters.endDate).format("YYYY/MM/DD")}`;

  const getBestClientsUrl = (filters) =>
    `/admin/best-clients?startDate=${moment(filters.startDate).format(
      "YYYY/MM/DD"
    )}&endDate=${moment(filters.endDate).format("YYYY/MM/DD")}&limit=${
      filters.limit
    }`;

  return (
    <>
      <EndpointTester
        title="Best Profession"
        getUrl={getBestProfessionUrl}
        getBody={() => undefined}
        filters={[
          { label: "Start date", key: "startDate", type: "date" },
          { label: "End date", key: "endDate", type: "date" },
        ]}
        method="GET"
      />
      <EndpointTester
        title="Best Clients"
        getUrl={getBestClientsUrl}
        getBody={() => undefined}
        filters={[
          { label: "Start date", key: "startDate", type: "date" },
          { label: "End date", key: "endDate", type: "date" },
          { label: "Limit", key: "limit", type: "number", default: 2 },
        ]}
        method="GET"
      />
    </>
  );
}

export default Admin;
