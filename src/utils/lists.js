const markets = [
  { id: 1, market_name: "Forex" },
  { id: 2, market_name: "Indices" },
  { id: 3, market_name: "Cryptocurrencies" },
  { id: 4, market_name: "Commodities" },
];

const operationsTypes = [
  { id: 1, operation_type_name: "Buy" },
  { id: 2, operation_type_name: "Sell" },
];

const signalStatus = [
  { id: 1, signal_status_name: "Active" },
  { id: 2, signal_status_name: "Inactive" },
  { id: 3, signal_status_name: "Completed" },
  { id: 4, signal_status_name: "Cancelled" },
  { id: 5, signal_status_name: "Pending" },
  { id: 6, signal_status_name: "Failed" },
  { id: 7, signal_status_name: "Scheduled" },
]

export const list = {
    markets,
    operationsTypes,
    signalStatus
}