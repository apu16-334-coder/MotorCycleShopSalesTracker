(function () {
    /* code */
    // All the section Content Object
    const welcome = document.querySelector(".welcome-section")
    const saleForm = document.querySelector(".sale-form-section")
    const saleCostRecords = document.querySelector(".sale-cost-records")
    const dashboardList = document.querySelector(".dashboard-list")
    const costForm = document.querySelector(".cost-form")

    let editFlag = false, editIndex, editDate;

    // Today
    const currentDate = new Date().toLocaleDateString();
    // console.log(currentDate)


    // statements object
    const totalSellingObj = document.querySelector(".total-selling")
    const totalProfitObj = document.querySelector(".total-profit")




    // All API Function
    function fetchDatesArray() {
        return JSON.parse(localStorage.getItem("dates"))
    }

    function setDatesArray(datesArray) {
        localStorage.setItem("dates", JSON.stringify(datesArray))
    }

    function fetchSalesRecords(date) {
        return JSON.parse(localStorage.getItem(date));
    }

    function setSalesRecordsArray(salesRecordsArray) {
        localStorage.setItem(currentDate, JSON.stringify(salesRecordsArray))
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

    function getTheSalesInputFieldsValue(salesField) {
        const productName = salesField.querySelector('input[placeholder="Product name"]').value;
        const buyingPrice = salesField.querySelector('input[placeholder="Buying price"]').value;
        const sellingPrice = salesField.querySelector('input[placeholder="Selling price"]').value;
        return { productName, buyingPrice, sellingPrice }
    }

    function cleanExtraSetOfInputFields(allSetOfInputFields) {
        let cleanSetOfInputFields;
        allSetOfInputFields.forEach((setOfInputFields, i) => {
            if (i ==! 0) {
                setOfInputFields.parentNode.removeChild(setOfInputFields);
            }else {
                cleanSetOfInputFields = setOfInputFields;
            }
        })

        return cleanSetOfInputFields;
    }


    function showSaleForm() {
        welcome.style.display = "none";
        saleCostRecords.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        saleForm.style.display = "block";
    }


    // All event Listener
    document.getElementById("startToday").addEventListener("click", createTodayRecords)

    document.getElementById("addSaleInputFields").addEventListener("click", addingAnotherSetOfSaleInputFields)

    document.getElementById("saleRecordForm").addEventListener("submit", (event) => {
        console.log(editFlag)
        if (editFlag) {
            addEditSalesRecords(event)
        } else {
            addingSalesRecords(event)
        }
    })

    document.querySelectorAll(".sale-cost-records-button").forEach((element) => {
        element.addEventListener("click", () => {
            showSalesRecords(currentDate);
        })
    })

    document.getElementById("toSaleFormBtn").addEventListener("click", () => {
        const allSetOfSaleInputFields = document.querySelectorAll(".set-of-sale-input-Fields")
        makeReadyToInsertRecords(allSetOfSaleInputFields)
    })

    document.getElementById("toCostFormBtn").addEventListener("click", makeReadyToInsertCostRecords)

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
            showSaleForm()
            return;
        }

        datesArray = fetchDatesArray();

        if (!datesArray.includes(currentDate)) {
            datesArray.push(currentDate)
            setDatesArray(datesArray)
            showSaleForm()
            return;
        }

        showSalesRecords(currentDate)
    }  

    function makeReadyToInsertRecords(allSetOfInputFields) {
        const cleanSetOfInputFields = cleanExtraSetOfInputFields(allSetOfInputFields)
        makeInputFieldsEmpty(cleanSetOfInputFields)
        showSaleForm()        
        editFlag = false;
    }

    function addingAnotherSetOfSaleInputFields() {
        const setOfsaleInputFields = document.querySelector(".set-of-sale-input-Fields");
        const SalesFormFooter = document.getElementById("sales-form-footer")

        const newSetOfsaleInputFields = makeNewSetOfSaleInputFields(setOfsaleInputFields)

        makeInputFieldsEmpty(newSetOfsaleInputFields)

        setOfsaleInputFields.parentNode.insertBefore(newSetOfsaleInputFields, SalesFormFooter)
    }

    function showSalesRecords() {
        const tableBody = document.getElementById("tableBody")
        tableBody.innerHTML = "";

        welcome.style.display = "none";
        saleForm.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        document.getElementById("date").innerText = currentDate;

        let salesRecordsArray = fetchSalesRecords(currentDate)
        console.log(salesRecordsArray)
        let totalSelling = 0, totalProfit = 0;

        if (salesRecordsArray) {
            salesRecordsArray.forEach((record, i) => {
                let tableRow = document.createElement("tr");
                tableRow.innerHTML = `<td>${record.productName}</td>
                            <td>${record.buyingPrice}</td>
                            <td>${record.sellingPrice}</td>
                            <td class="profit">${record.profit}</td>
                            <td><button data-index="${i}" class="icon-btn edit">✏️</button></td>
                            <td><button data-index="${i}" class="icon-btn delete">🗑️</button></td>`
                tableBody.appendChild(tableRow)
                // console.log(tableRow.querySelector(".edit"))
                // console.log(tableRow.querySelector(".delete"))
                tableRow.querySelector(".edit").addEventListener("click", makeReadyToEditTheRecord)
                tableRow.querySelector(".delete").addEventListener("click", deleteTheRecord)

                totalSelling += Number(record.sellingPrice);
                totalProfit += Number(record.profit);
            })

        }
        console.log(totalSelling + " " + totalProfit)
        totalSellingObj.textContent = totalSelling;
        totalProfitObj.textContent = totalProfit;

        saleCostRecords.style.display = "block";
    }

    function makeReadyToInsertCostRecords() {
        welcome.style.display = "none"
        saleForm.style.display = "none"
        saleCostRecords.style.display = "none"
        dashboardList.style.display = "none"


        costForm.style.display = "block";
    }

    function showDashBoard() {
        welcome.style.display = "none";
        saleForm.style.display = "none";
        costForm.style.display = "none";
        saleCostRecords.style.display = "none";

        dashboardList.style.display = "block";
    }



    // All Form Submit Function
    function addingSalesRecords(event) {
        event.preventDefault()
        const allSalesFields = document.querySelectorAll(".salesFields")
        console.log("called adding sales records");

        let salesRecordsArray = fetchSalesRecords(currentDate)

        if (!salesRecordsArray) {
            salesRecordsArray = []
        }

        allSalesFields.forEach((salesField, i) => {
            const allFieldsValue = getTheSalesInputFieldsValue(salesField)
            const record = makeASalesRecord(allFieldsValue)

            salesRecordsArray.push(record)

            setSalesRecordsArray(salesRecordsArray)

        })
        showSalesRecords(currentDate)
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

// localStorage.clear()




