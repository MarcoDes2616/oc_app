const markets = [
  { market_name: "Forex" },
  { market_name: "Indices" },
  { market_name: "Cryptocurrencies" },
  { market_name: "Commodities" },
];

const operationsTypes = [
  { operation_type_name: "Buy" },
  { operation_type_name: "Sell" },
];

const signalStatus = [
  { signal_status_name: "Active" },
  { signal_status_name: "Inactive" },
  { signal_status_name: "Completed" },
  { signal_status_name: "Cancelled" },
  { signal_status_name: "Pending" },
  { signal_status_name: "Rejected" },
  { signal_status_name: "Approved" },
  { signal_status_name: "Expired" },
  { signal_status_name: "Failed" },
  { signal_status_name: "Processing" },
  { signal_status_name: "On Hold" },
  { signal_status_name: "Draft" },
  { signal_status_name: "Archived" },
  { signal_status_name: "Scheduled" },
  { signal_status_name: "Confirmed" },
  { signal_status_name: "Unconfirmed" },
]

export const list = [
    markets,
    operationsTypes,
    signalStatus
]