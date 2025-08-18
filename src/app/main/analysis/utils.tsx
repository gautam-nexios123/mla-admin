const order = ["RX", "PP", "AP", "HU", "CR", "LS", "OM", "Vintage", "Other"];

export function sortData(data, key) {
  // Create a mapping of _id to its index in the order array
  const orderMap = new Map(order.map((item, index) => [item, index]));

  // Sort the data array based on the order map
  data.sort((a, b) => {
    const indexA = orderMap.has(a?.[key])
      ? orderMap.get(a?.[key])
      : order.length;
    const indexB = orderMap.has(b?.[key])
      ? orderMap.get(b?.[key])
      : order.length;
    return indexA - indexB;
  });

  return data;
}


export const getColor = (value) => {
  switch (value) {
    case "RX":
      return "#2a2dc5";
    case "PP":
      return "#741b47";
    case "AP":
      return "#351d75";
    case "HU":
      return "#1055cc";
    case "CR":
      return "#0c5395";
    case "LS":
      return "#144f5d";
    case "OM":
      return "#bf9100";
    case "Vintage":
      return "#c17ba0";
    case "Other":
      return "#46bcc6";
    default:
      return "black";
  }
};