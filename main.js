const bourstadStartingAmount = 200000;

// Get all paragraph elements in info box and return the stats
function getAccountDetails() {
    const infoBox = document.getElementsByClassName("jumbotron jumbotron-style")[0];
    const statElements = infoBox.getElementsByTagName("p");

    return {
        "value": parseFloat(statElements[0].textContent.split(": ")[1].replaceAll(/\s/g, '')),
        "cash": parseFloat(statElements[1].textContent.split(": ")[1].replaceAll(/\s/g, '')),
        "buying_power": parseFloat(statElements[2].textContent.split(": ")[1].replaceAll(/\s/g, '')),
        "positions_value": parseFloat(statElements[3].textContent.split(": ")[1].replaceAll(/\s/g, '')),
        "shorts_value": parseFloat(statElements[4].textContent.split(": ")[1].replaceAll(/\s/g, ''))
    };
}

// Get stock data and return the stats
function getStockDetails() {
    const infoBox = document.getElementsByClassName("jumbotron jumbotron-style")[1];
    const statElements = infoBox.getElementsByTagName("p");

    return {
        "bid": parseFloat(statElements[1].textContent.split(": ")[1].replaceAll(/\s/g, '')),
        "ask": parseFloat(statElements[2].textContent.split(": ")[1].replaceAll(/\s/g, ''))
    };
}

// Calculate the field data and return the stats
function calculateBuyTransactionDetails() {
    let stockAmount;
    let newStockAmount;
    let newCashAmount;
    let categories = [];
    let incomeTarget;
    let capitalGainTarget;

    const investmentAmountInput = window.prompt("What percentage of your total portfolio should be invested on this stock? (Wrap the value in parentheses to specify an arbitrary amount of stock)");
    if (investmentAmountInput.indexOf("(") > -1) {
        stockAmount = parseInt(investmentAmountInput.split("(")[1].split(")")[0], 10);
    } else {
        const targetInvestmentAmount = parseFloat(investmentAmountInput) / 100 * bourstadStartingAmount;
        stockAmount = Math.round(targetInvestmentAmount / getStockDetails().ask);
    }

    let existingStockAmount;
    const existingStockAmountInput = window.prompt("How many shares of this stock do you already own?\nLeave blank if zero");
    if (!existingStockAmountInput) {
        existingStockAmount = 0;
    } else {
        existingStockAmount = parseInt(existingStockAmountInput, 10);
    }
    newStockAmount = stockAmount + existingStockAmount;

    newCashAmount = Math.round(getAccountDetails().cash - (stockAmount * getStockDetails().ask));
    if (newCashAmount < 0) {
        window.alert("Overdraft, be careful!");
    }

    const investmentCategoryInput = window.prompt("Which categories apply to this stock?\n(L)iquid Assets, (B)onds, (U)tilities, (F)inancial Services, (C)onsumer Products, (I)ndustrial Products, (N)atural Resources\nInput only the first letter of each applicable category\n(Leave blank to set this field manually)").toUpperCase();
    if (investmentCategoryInput.trim().length > 0) {
        if (investmentCategoryInput.indexOf("L") > -1) {
            categories.push("Liquid Assets");
        }
        if (investmentCategoryInput.indexOf("B") > -1) {
            categories.push("Bonds");
        }
        if (investmentCategoryInput.indexOf("U") > -1) {
            categories.push("Utilities");
        }
        if (investmentCategoryInput.indexOf("F") > -1) {
            categories.push("Financial Services");
        }
        if (investmentCategoryInput.indexOf("C") > -1) {
            categories.push("Consumer Products");
        }
        if (investmentCategoryInput.indexOf("I") > -1) {
            categories.push("Industrial Products");
        }
        if (investmentCategoryInput.indexOf("N") > -1) {
            categories.push("Natural Resources");
        }
    }

    const incomeTargetInput = window.prompt("What is your targeted price change for this stock, in percentage?");
    capitalGainTarget = parseFloat(incomeTargetInput);
    incomeTarget = ((parseFloat(incomeTargetInput) / 100) * (capitalGainTarget / 100)) * 100;

    return {
        "stock_amount": stockAmount,
        "new_stock_amount": newStockAmount,
        "new_cash_amount": newCashAmount,
        "categories": categories,
        "income_target": incomeTarget,
        "capital_gain_target": capitalGainTarget
    };
}

// Automatically fill in all input fields
function autoFillBuyInputs() {
    const buyTransactionDetails = calculateBuyTransactionDetails();
    document.getElementById("quantitedeclare").value = buyTransactionDetails.stock_amount;
    document.getElementById("quantitedeclare").focus(); // Refresh form
    document.getElementById("qte_apres").value = buyTransactionDetails.new_stock_amount;
    document.getElementById("solde_apres").value = buyTransactionDetails.new_cash_amount;
    if (buyTransactionDetails.categories.includes("Liquid Assets")) document.getElementsByName("ddl_liquidites")[0].value = 1;
    if (buyTransactionDetails.categories.includes("Bonds")) document.getElementsByName("ddl_obligations")[0].value = 1;
    if (buyTransactionDetails.categories.includes("Utilities")) document.getElementsByName("ddl_services_publics")[0].value = 1;
    if (buyTransactionDetails.categories.includes("Financial Services")) document.getElementsByName("ddl_services_financiers")[0].value = 1;
    if (buyTransactionDetails.categories.includes("Consumer Products")) document.getElementsByName("ddl_produits_consommation")[0].value = 1;
    if (buyTransactionDetails.categories.includes("Industrial Products")) document.getElementsByName("ddl_produits_industriels")[0].value = 1;
    if (buyTransactionDetails.categories.includes("Natural Resources")) document.getElementsByName("ddl_ressources_naturelles")[0].value = 1;
    document.getElementById("objectif_revenu").value = buyTransactionDetails.income_target;
    document.getElementById("objectif_plusvalue").value = buyTransactionDetails.capital_gain_target;
    if (window.confirm(`You are about to buy ${buyTransactionDetails.stock_amount} shares at a price of ${getStockDetails().bid}$. Your cash balance will be of ${buyTransactionDetails.new_cash_amount}$ after the transaction.\nContinue?`)) {
        document.querySelectorAll(`a[href="#next"]`)[0].click();
    }
}

autoFillBuyInputs();
