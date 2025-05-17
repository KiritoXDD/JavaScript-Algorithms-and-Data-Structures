let price = 19.5;
let cid = [
    ["PENNY", 0.5],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0]
];

document.getElementById('purchase-btn').addEventListener('click', function() {
    let cash = parseFloat(document.getElementById('cash').value);
    let changeDue = cash - price;
    let changeDueElement = document.getElementById('change-due');

    if (isNaN(cash)) {
        changeDueElement.textContent = "Por favor, ingrese un monto válido.";
        return;
    }

    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (cash === price) {
        changeDueElement.textContent = "No change due - customer paid with exact cash";
        return;
    }

    let totalCID = cid.reduce((sum, denomination) => sum + denomination[1], 0);
    totalCID = Math.round(totalCID * 100) / 100;

    if (totalCID < changeDue) {
        changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    let change = calculateChange(changeDue, cid);

    if (change.status === "INSUFFICIENT_FUNDS") {
        changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (change.status === "CLOSED") {
        let filteredChange = change.change
            .filter(denom => denom[1] > 0)
            .sort((a, b) => getDenominationValue(b[0]) - getDenominationValue(a[0]));
        let changeString = filteredChange
            .map(denomination => `${denomination[0]}: $${denomination[1].toFixed(2)}`)
            .join(' ');
        changeDueElement.textContent = `Status: CLOSED ${changeString}`;
    } else {
        let changeString = change.change
            .map(denomination => `${denomination[0]}: $${denomination[1].toFixed(2)}`)
            .join(' ');
        changeDueElement.textContent = `Status: OPEN ${changeString}`;
    }
});

function calculateChange(changeDue, cid) {
    let change = [];
    let remainingChange = changeDue;
    let totalCID = cid.reduce((sum, denomination) => sum + denomination[1], 0);
    totalCID = Math.round(totalCID * 100) / 100;

    if (totalCID === changeDue) {
        let filteredCid = cid
            .filter(denom => denom[1] > 0)
            .sort((a, b) => getDenominationValue(b[0]) - getDenominationValue(a[0]))
            .map(denom => [denom[0], Math.round(denom[1] * 100) / 100]);
        return { status: "CLOSED", change: filteredCid };
    }

    for (let i = cid.length - 1; i >= 0; i--) {
        let denominationName = cid[i][0];
        let denominationValue = getDenominationValue(denominationName);
        let availableAmount = cid[i][1];
        let amountToReturn = 0;

        while (remainingChange >= denominationValue && availableAmount > 0) {
            remainingChange = Math.round((remainingChange - denominationValue) * 100) / 100;
            availableAmount = Math.round((availableAmount - denominationValue) * 100) / 100;
            amountToReturn = Math.round((amountToReturn + denominationValue) * 100) / 100;
        }

        if (amountToReturn > 0) {
            change.push([denominationName, amountToReturn]);
        }
    }

    if (remainingChange > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    return { status: "OPEN", change: change };
}

function getDenominationValue(denominationName) {
    switch (denominationName) {
        case "PENNY":
            return 0.01;
        case "NICKEL":
            return 0.05;
        case "DIME":
            return 0.10;
        case "QUARTER":
            return 0.25;
        case "ONE":
            return 1;
        case "FIVE":
            return 5;
        case "TEN":
            return 10;
        case "TWENTY":
            return 20;
        case "ONE HUNDRED":
            return 100;
        default:
            return 0;
    }
}