(function () {
    /* code */
    // All the section Content Object
    const welcome = document.querySelector(".welcome-section")
    const saleForm = document.querySelector(".sale-form-section")
    const saleCostRecords = document.querySelector(".sale-cost-records")
    const dashboardList = document.querySelector(".dashboard-list")
    const costForm = document.querySelector(".cost-form-section")


    let editFlag = false, editIndex, editDate;



    // Today
    const currentDate = new Date().toLocaleDateString();
    // console.log(currentDate)



    // statements object
    const totalCostObj = document.querySelector(".total-cost")
    const netProfitObj = document.querySelector(".net-profit")



    // All API Function
    function fetchDatesArray() {
        return JSON.parse(localStorage.getItem("dates"))
    }

    function setDatesArray(datesArray) {
        localStorage.setItem("dates", JSON.stringify(datesArray))
    }

    function fetchRecords(date) {
        return JSON.parse(localStorage.getItem(date));
    }

    function setRecordsArray(salesCostsRecordsArray) {
        localStorage.setItem(currentDate, JSON.stringify(salesCostsRecordsArray))
    }



    // All Input Fields Function
    function makeNewSetOfInputFields(inputFields) {
        const newInputFields = inputFields.cloneNode(true);
        return newInputFields;
    }

    function cleanExtraSetOfInputFields(allSetOfInputFields) {
        let cleanSetOfInputFields;
        allSetOfInputFields.forEach((setOfInputFields, i) => {
            if (i == !0) {
                setOfInputFields.parentNode.removeChild(setOfInputFields);
            } else {
                cleanSetOfInputFields = setOfInputFields;
            }
        })

        return cleanSetOfInputFields;
    }

    function makeInputFieldsEmpty(setOfInputFields) {
        for (const inputField of setOfInputFields.querySelectorAll("input")) {
            inputField.value = "";
        }
    }



    // Making Records Function
    function makeASaleRecord([productName, buyingPrice, sellingPrice]) {
        return {
            "productName": productName,
            "buyingPrice": buyingPrice,
            "sellingPrice": sellingPrice,
            "profit": sellingPrice - buyingPrice
        }
    }

    function makeACostRecord([costDetails, costAmount]) {
        return {
            "costDetails": costDetails,
            "costAmount": costAmount,
        }
    }



    // Getting Input Fields Values Function
    function getSaleInputFieldsValue(setOfSaleInputFields) {
        const productName = setOfSaleInputFields.querySelector('input[placeholder="Product name"]').value;
        const buyingPrice = setOfSaleInputFields.querySelector('input[placeholder="Buying price"]').value;
        const sellingPrice = setOfSaleInputFields.querySelector('input[placeholder="Selling price"]').value;
        return [productName, buyingPrice, sellingPrice]
    }

    function getCostInputFieldsValue(setOfCostInputFields) {
        const costDetails = setOfCostInputFields.querySelector('input[placeholder="Cost details"]').value;
        const costAmount = setOfCostInputFields.querySelector('input[placeholder="Cost amount"]').value;

        return [costDetails, costAmount]
    }



    // Display All Forms
    function displayForm(form) {
        welcome.style.display = "none";
        saleCostRecords.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";
        saleForm.style.display = "none";

        form.style.display = "block";
    }



    // All Table Function
    function displaySalesCostsRecords() {
        welcome.style.display = "none";
        saleForm.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        saleCostRecords.style.display = "block";
    }

    function makeReadyToShowRecords(salesCostsRecordsArray, tableBody, index, recordName) {
        let recordsArray = salesCostsRecordsArray[index][recordName]
        console.log(recordsArray)
        let totalSell = 0, totalProfit = 0, totalCost = 0;

        if (recordsArray) {
            recordsArray.forEach((record, i) => {
                let tableRow = document.createElement("tr");
                tableRow.innerHTML = (recordName === "sale") ? getSaleTableRowString(record, i) : getCostTableRowString(record, i)

                tableBody.appendChild(tableRow)
                // console.log(tableRow.querySelector(".edit"))
                // console.log(tableRow.querySelector(".delete"))
                tableRow.querySelector(".edit").addEventListener("click", (event) => {
                    makeReadyToEditTheRecord(event, recordName)
                })
                tableRow.querySelector(".delete").addEventListener("click", (event) => {
                    deleteTheRecord(event, recordName)
                })

                if (recordName === "sale") {
                    totalSell += Number(record.sellingPrice);
                    totalProfit += Number(record.profit);
                } else {
                    totalCost += Number(record.costAmount)
                }
            })

        }
        console.log(totalSell + " " + totalProfit)
        console.log(totalCost)
        if (recordName === "sale") {
            return [totalSell, totalProfit]
        } else {
            return totalCost
        }
    }



    // All Table Row Inner HTML
    function getSaleTableRowString(record, i) {
        return `<td>${record.productName}</td>
                <td>${record.buyingPrice}</td>
                <td>${record.sellingPrice}</td>
                <td class="profit">${record.profit}</td>
                <td><button data-index="${i}" class="icon-btn edit">✏️</button></td>
                <td><button data-index="${i}" class="icon-btn delete">🗑️</button></td>`
    }

    function getCostTableRowString(record, i) {
        return `<td>${i + 1}</td>
                <td>${record.costDetails}</td>
                <td class="cost-amount">${record.costAmount}</td>
                <td><button data-index="${i}" class="icon-btn edit">✏️</button></td>
                <td><button data-index="${i}" class="icon-btn delete">🗑️</button></td>`
    }



    // Set Summary Of Calculation
    function setSaleRecordSummary(totalSell, totalProfit) {
        document.getElementById("totalSell").innerHTML = totalSell;
        document.getElementById("totalProfit").innerHTML = totalProfit;
    }

    function setCostRecordSummary(totalCost, netProfit) {
        document.getElementById("totalCost").innerHTML = totalCost;
        document.getElementById("netProfit").innerHTML = netProfit;
    }


    function setSaleInputFieldsValue(saleCostRecordsArray) {
        theRecord = saleCostRecordsArray[0].sale[editIndex]
        console.log(theRecord)

        const productName = theRecord.productName;
        const buyingPrice = theRecord.buyingPrice;
        const sellingPrice = theRecord.sellingPrice;

        cleanExtraSetOfInputFields(document.querySelectorAll(".set-of-sale-input-Fields"))

        const setOfSaleInputFields = document.querySelector(".set-of-sale-input-Fields");
        setOfSaleInputFields.querySelector('input[placeholder="Product name"]').value = productName;
        setOfSaleInputFields.querySelector('input[placeholder="Buying price"]').value = buyingPrice;
        setOfSaleInputFields.querySelector('input[placeholder="Selling price"]').value = sellingPrice;
    }

    function setCostInputFieldsvalue(saleCostRecordsArray) {
        theRecord = saleCostRecordsArray[1].cost[editIndex]
        console.log(theRecord)

        const costDetails = theRecord.costDetails;
        const costAmount = theRecord.costAmount;


        cleanExtraSetOfInputFields(document.querySelectorAll(".set-of-cost-input-Fields"))

        const setOfSaleInputFields = document.querySelector(".set-of-cost-input-Fields");
        setOfSaleInputFields.querySelector('input[placeholder="Cost details"]').value = costDetails;
        setOfSaleInputFields.querySelector('input[placeholder="Cost amount"]').value = costAmount;
    }

    // Dynamic Event Listener Function
    function makeReadyToEditTheRecord(event, recordName) {
        editIndex = event.target.dataset.index
        console.log(editIndex)
        console.log("editing...")
        let theRecord;
        // editDate = document.getElementById("date").textContent
        // console.log(editDate)
        const saleCostRecordsArray = fetchRecords(currentDate);

        if (recordName === "sale") {
            setSaleInputFieldsValue(saleCostRecordsArray)
            displayForm(saleForm)
        } else {
            setCostInputFieldsvalue(saleCostRecordsArray)
            displayForm(costForm)
        }
        editFlag = true;
    }

    function deleteTheRecord(event, recordName) {
        console.log(event.target.dataset.index)
        const saleCostRecordsArray = fetchRecords(currentDate);
        let recordsArray;
        if(recordName === "sale"){
            recordsArray = saleCostRecordsArray[0].sale
        }else {
            recordsArray = saleCostRecordsArray[1].cost
        }

        recordsArray.splice(event.target.dataset.index, 1);
        
        if(recordName === "sale"){
            saleCostRecordsArray[0].sale = recordsArray
        }else {
            saleCostRecordsArray[1].cost = recordsArray
        }

        setRecordsArray(saleCostRecordsArray);
        showSalesCostsRecords(currentDate)
    }



    // All event Listener
    document.getElementById("startToday").addEventListener("click", createTodayRecords)

    document.getElementById("addSaleInputFields").addEventListener("click", () => {
        const setOfSaleInputFields = document.querySelector(".set-of-sale-input-Fields");
        addingAnotherSetOfInputFields(setOfSaleInputFields, saleForm)
    })

    document.getElementById("addCostInputFields").addEventListener("click", () => {
        const setOfCostInputFields = document.querySelector(".set-of-cost-input-Fields");
        addingAnotherSetOfInputFields(setOfCostInputFields, costForm)
    })

    document.getElementById("saleRecordForm").addEventListener("submit", (event) => {
        console.log(editFlag)
        if (editFlag) {
            addEditRecords(event, 0, "sale", getSaleInputFieldsValue, makeASaleRecord)
        } else {
            const allSetOfSaleInputFields = document.querySelectorAll(".set-of-sale-input-Fields")

            addingRecords(event, allSetOfSaleInputFields, 0, "sale", getSaleInputFieldsValue, makeASaleRecord)
        }
    })

    document.getElementById("costRecordForm").addEventListener("submit", (event) => {
        console.log(editFlag)
        if (editFlag) {
            addEditRecords(event, 1, "cost", getCostInputFieldsValue, makeACostRecord)
        } else {
            const allSetOfCostInputFields = document.querySelectorAll(".set-of-cost-input-Fields")

            addingRecords(event, allSetOfCostInputFields, 1, "cost", getCostInputFieldsValue, makeACostRecord)
        }
    })

    document.querySelectorAll(".sale-cost-records-button").forEach((element) => {
        element.addEventListener("click", () => {
            showSalesCostsRecords(currentDate);
        })
    })

    document.getElementById("toSaleFormBtn").addEventListener("click", () => {
        const allSetOfSaleInputFields = document.querySelectorAll(".set-of-sale-input-Fields")
        makeReadyToInsertRecords(allSetOfSaleInputFields)
        displayForm(saleForm)
    })

    document.getElementById("toCostFormBtn").addEventListener("click", () => {
        const allSetOfCostInputFields = document.querySelectorAll(".set-of-cost-input-Fields")
        makeReadyToInsertRecords(allSetOfCostInputFields)
        displayForm(costForm)
    })

    document.querySelectorAll(".to-dashboard-button").forEach((element) => {
        element.addEventListener("click", showDashBoard);
    })



    // All event Listener Function
    function createTodayRecords() {
        let datesArray = []
        // if datesArrayString is empty
        if (!fetchDatesArray()) {
            datesArray.push(currentDate)
            setDatesArray(datesArray)
            displayForm(saleForm)
            return;
        }

        datesArray = fetchDatesArray();

        if (!datesArray.includes(currentDate)) {
            datesArray.push(currentDate)
            setDatesArray(datesArray)
            displayForm(saleForm)
            return;
        }

        showSalesCostsRecords(currentDate)
    }

    function makeReadyToInsertRecords(allSetOfInputFields) {
        const cleanSetOfInputFields = cleanExtraSetOfInputFields(allSetOfInputFields)
        makeInputFieldsEmpty(cleanSetOfInputFields)
        editFlag = false;
    }

    function addingAnotherSetOfInputFields(setOfInputFields, form) {

        const formFooter = form.querySelector(".form-footer")

        const newSetOfInputFields = makeNewSetOfInputFields(setOfInputFields)

        makeInputFieldsEmpty(newSetOfInputFields)

        setOfInputFields.parentNode.insertBefore(newSetOfInputFields, formFooter)
    }

    function showSalesCostsRecords(date) {
        let salesCostsRecordsArray = fetchRecords(date)

        if (salesCostsRecordsArray) {
            document.getElementById("recordDate").innerText = date;
            // makeReadyToShowSalesRecords()
            const saleTableBody = document.getElementById("saleTableBody")
            saleTableBody.innerHTML = "";
            let [totalSell, totalProfit] = makeReadyToShowRecords(salesCostsRecordsArray, saleTableBody, 0, "sale")
            setSaleRecordSummary(totalSell, totalProfit)

            const costTableBody = document.getElementById("costTableBody")
            costTableBody.innerHTML = "";
            let totalCost = makeReadyToShowRecords(salesCostsRecordsArray, costTableBody, 1, "cost")
            setCostRecordSummary(totalCost, totalProfit - totalCost)
        }

        displaySalesCostsRecords();
    }

    function showDashBoard() {
        welcome.style.display = "none";
        saleForm.style.display = "none";
        costForm.style.display = "none";
        saleCostRecords.style.display = "none";

        dashboardList.style.display = "block";
    }



    // All Form Submit Function
    function addingRecords(event, allSetOfInputFields, index, recordName, getInputFieldsValue, makeARecord) {
        event.preventDefault()
        console.log("called adding sales cost records");

        let salesCostsRecordsArray = fetchRecords(currentDate)


        if (!salesCostsRecordsArray) {
            salesCostsRecordsArray = [{}, {}]
        }

        let recordsArray = salesCostsRecordsArray[index][recordName]

        if (!recordsArray) {
            recordsArray = []
        }

        allSetOfInputFields.forEach((setOfinputFields, i) => {
            const allFieldsValueArray = getInputFieldsValue(setOfinputFields)
            const record = makeARecord(allFieldsValueArray)

            recordsArray.push(record)
            salesCostsRecordsArray[index][recordName] = recordsArray;

            setRecordsArray(salesCostsRecordsArray);
        })

        showSalesCostsRecords(currentDate)
    }

    function addEditRecords(event, index, recordName, getInputFieldsValue, makeARecord) {
        event.preventDefault()
        console.log("editing.......")
        let salesCostsRecordsArray = fetchRecords(currentDate)
        let recordsArray = salesCostsRecordsArray[index][recordName]
        const theRecord = recordsArray[editIndex]
        let setOfInputFields;
        if (recordName === "sale") {
            setOfInputFields = document.querySelector(".set-of-sale-input-Fields")
        } else {
            setOfInputFields = document.querySelector(".set-of-cost-input-Fields")
        }

        const allFieldsValueArray = getInputFieldsValue(setOfInputFields)
        const record = makeARecord(allFieldsValueArray)
        recordsArray.splice(editIndex, 1, record)

        //     showSalesCostsRecords(editDate)
        salesCostsRecordsArray[index][recordName] = recordsArray;
        setRecordsArray(salesCostsRecordsArray)
        showSalesCostsRecords(currentDate)
    }
})()

// localStorage.clear()


