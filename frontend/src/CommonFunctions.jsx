export function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    var n_format=`${month}/${day}/${year}`;

    return n_format;
}

export function formatBudget(budget) {
    return "$ " + new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(budget);
}