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



    function fetchRecords(date) {
        return JSON.parse(localStorage.getItem(date));
    }

    function setRecordsArray(salesCostsRecordsArray) {
        localStorage.setItem(currentDate, JSON.stringify(salesCostsRecordsArray))
    }



    // All Other Function
    function makeInputFieldsEmpty(setOfInputFields) {
        for (const inputField of setOfInputFields.querySelectorAll("input")) {
            inputField.value = "";
        }
    }

    function makeNewSetOfSaleInputFields(salesFields) {
        const newSalesFields = salesFields.cloneNode(true);
        return newSalesFields;
    }

    function makeASalesRecord({ productName, buyingPrice, sellingPrice }) {
        return {
            "productName": productName,
            "buyingPrice": buyingPrice,
            "sellingPrice": sellingPrice,
            "profit": sellingPrice - buyingPrice
        }
    }

    function getSalesInputFieldsValue(salesField) {
        const productName = salesField.querySelector('input[placeholder="Product name"]').value;
        const buyingPrice = salesField.querySelector('input[placeholder="Buying price"]').value;
        const sellingPrice = salesField.querySelector('input[placeholder="Selling price"]').value;
        return { productName, buyingPrice, sellingPrice }
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

    function displaySaleForm() {
        welcome.style.display = "none";
        saleCostRecords.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        saleForm.style.display = "block";
    }

    function addingRecords() {

    }


    // Dynamic Event Listener Function
    function makeReadyToEditTheRecord(event) {
        editIndex = event.target.dataset.index
        console.log(editIndex)
        editDate = document.getElementById("date").textContent
        console.log(editDate)

        let theRecord = fetchSalesRecords(editDate)[editIndex]
        console.log(theRecord)

        const productName = theRecord.productName;
        const buyingPrice = theRecord.buyingPrice;
        const sellingPrice = theRecord.sellingPrice;

        makeReadyToInsertSalesRecords()

        const salesFields = document.querySelector(".salesFields");
        salesFields.querySelector('input[placeholder="Product name"]').value = productName;
        salesFields.querySelector('input[placeholder="Buying price"]').value = buyingPrice;
        salesFields.querySelector('input[placeholder="Selling price"]').value = sellingPrice;

        editFlag = true;
    }

    function deleteTheRecord(e) {
        console.log(e.target.dataset.index)
        let date = document.getElementById("date").textContent
        console.log(date)
        let salesRecordsArray = fetchSalesRecords(date)
        salesRecordsArray.splice(e.target.dataset.index, 1)
        console.log(salesRecordsArray);

        setSalesRecordsArray(salesRecordsArray)
        showSalesRecords(date)
    }



    // All event Listener
    document.getElementById("startToday").addEventListener("click", createTodayRecords)

    document.getElementById("addSaleInputFields").addEventListener("click", () => {
        const setOfSaleInputFields = document.querySelector(".set-of-sale-input-Fields");
        addingAnotherSetOfSaleFields(setOfSaleInputFields)
    })

    document.getElementById("saleRecordForm").addEventListener("submit", (event) => {
        console.log(editFlag)
        if (editFlag) {
            addEditSalesRecords(event)
        } else {
            const allSetOfSaleInputFields = document.querySelectorAll(".set-of-sale-input-Fields")
            let index = 0;
            let recordName = "sale"

            addingRecords(event, allSetOfSaleInputFields, index, recordName, getSalesInputFieldsValue, makeASalesRecord)
        }
    })

    document.querySelectorAll(".sale-cost-records-button").forEach((element) => {
        element.addEventListener("click", () => {
            showSalesRecords();
        })
    })

    document.getElementById("toSaleFormBtn").addEventListener("click", () => {
        const allSetOfSaleInputFields = document.querySelectorAll(".set-of-sale-input-Fields")
        makeReadyToInsertRecords(allSetOfSaleInputFields)
    })

    document.getElementById("toCostFormBtn").addEventListener("click", () => {

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
            displaySaleForm()
            return;
        }

        datesArray = fetchDatesArray();

        if (!datesArray.includes(currentDate)) {
            datesArray.push(currentDate)
            setDatesArray(datesArray)
            displaySaleForm()
            return;
        }

        showSalesRecords(currentDate)
    }

    function makeReadyToInsertRecords(allSetOfInputFields) {
        const cleanSetOfInputFields = cleanExtraSetOfInputFields(allSetOfInputFields)
        makeInputFieldsEmpty(cleanSetOfInputFields)
        displaySaleForm()
        editFlag = false;
    }

    function addingAnotherSetOfSaleFields(setOfInputFields) {

        const SalesFormFooter = document.getElementById("sales-form-footer")

        const newSetOfsaleFields = makeNewSetOfSaleInputFields(setOfInputFields)

        makeInputFieldsEmpty(newSetOfsaleFields)

        setOfInputFields.parentNode.insertBefore(newSetOfsaleFields, SalesFormFooter)
    }


    function displaySalesCostsRecords() {
        welcome.style.display = "none";
        saleForm.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        saleCostRecords.style.display = "block";
    }

    function getSaleTableRowString(record, i) {
        return `<td>${record.productName}৳</td>
                <td>${record.buyingPrice}৳</td>
                <td>${record.sellingPrice}৳</td>
                <td class="profit">${record.profit}</td>
                <td><button data-index="${i}" class="icon-btn edit">✏️</button></td>
                <td><button data-index="${i}" class="icon-btn delete">🗑️</button></td>`
    }

    function getCostTableRowString(record, i) {
        return `<td>${i}</td>
                <td>${record.costDetails}৳</td>
                <td class="cost-amount">250৳</td>
                <td><button class="icon-btn edit">✏️</button></td>
                <td><button class="icon-btn delete">🗑️</button></td>`
    }

    function makeReadyToShowRecords(tableBody, index, recordName) {
        let recordsArray = fetchRecords(currentDate)[index][recordName]
        console.log(recordsArray)
        let totalSell = 0, totalProfit = 0, totalCost = 0;

        if (recordsArray) {
            recordsArray.forEach((record, i) => {
                let tableRow = document.createElement("tr");
                tableRow.innerHTML = (recordName === "sale") ? getSaleTableRowString(record, i) : getCostTableRowString(record, i)

                tableBody.appendChild(tableRow)
                // console.log(tableRow.querySelector(".edit"))
                // console.log(tableRow.querySelector(".delete"))
                tableRow.querySelector(".edit").addEventListener("click", () => {
                    makeReadyToEditTheRecord(recordName)
                })
                tableRow.querySelector(".delete").addEventListener("click", () => {
                    deleteTheRecord(recordName)
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

    function setSaleRecordSummary(totalSell, totalProfit) {
        document.getElementById("totalSell").innerHTML = totalSell;
        document.getElementById("totalProfit").innerHTML = totalProfit;
    }

    function showSalesCostsRecords() {
        document.getElementById("recordDate").innerText = currentDate;
        // makeReadyToShowSalesRecords()
        const saleTableBody = document.getElementById("saleTableBody")
        saleTableBody.innerHTML = "";
        let [totalSell, totalProfit] = makeReadyToShowRecords(saleTableBody, 0, "sale")
        setSaleRecordSummary(totalSell, totalProfit)




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
        console.log("called adding sales records");

        let salesCostsRecordsArray = fetchRecords(currentDate)
        let recordsArray = []
        if (salesCostsRecordsArray) {
            recordsArray = salesCostsRecordsArray[index][recordName]
        } else {
            salesCostsRecordsArray = [{}, {}]
        }

        allSetOfInputFields.forEach((setOfinputFields, i) => {
            const allFieldsValue = getInputFieldsValue(setOfinputFields)
            const record = makeARecord(allFieldsValue)

            recordsArray.push(record)
            salesCostsRecordsArray[0].sale = recordsArray;

            setRecordsArray(salesCostsRecordsArray);
        })

        showSalesCostsRecords(currentDate)
    }




    function addEditSalesRecords(event) {
        event.preventDefault()
        console.log("editing......")
        const allFieldsValue = getTheSalesInputFieldsValue(document.querySelector(".salesFields"))
        const record = makeASalesRecord(allFieldsValue)
        console.log(record)
        const salesRecordsArray = fetchSalesRecords(editDate)

        salesRecordsArray.splice(editIndex, 1, record);

        console.log(salesRecordsArray)

        setSalesRecordsArray(salesRecordsArray)

        showSalesRecords(editDate)
    }

})()

localStorage.clear()



