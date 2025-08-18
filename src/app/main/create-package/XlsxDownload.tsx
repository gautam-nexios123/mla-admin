import * as XLSX from "xlsx";
export const HandleDownload = (data) => {
    console.log(data);
    
  const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet
    );
  const arrayBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  // Create temporary anchor element
  const a = document.createElement("a");
  a.href = url;
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  a.download =(`package-${date}.csv`);
  // Simulate click on anchor element
  document.body.appendChild(a);
  a.click();
  // Clean up
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};