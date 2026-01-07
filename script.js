(function () {
    /* code */
    // All the Dom Content Object
    const hero = document.querySelector(".hero")
    const addRecord = document.querySelector(".add-record")
    const salesCostRecords = document.querySelector(".sales-cost-records")
    const dashboardList = document.querySelector(".dashboard-list")
    const costForm = document.querySelector(".cost-form")

    // Today
    const currentDate = new Date().toLocaleDateString();
    // console.log(currentDate)


    // Statements object
    const totalSellingObj = document.querySelector(".TotalSelling")
    const totalProfitObj = document.querySelector(".TotalProfit")


    document.getElementById("startToday").addEventListener("click", createTodayRecords)

    document.getElementById("btnDashboard").addEventListener("click", showDashBoard)

    document.getElementById("addSalesFields").addEventListener("click", addingRowsInSalesForm)


    document.getElementById("dailyRecordForm").addEventListener("submit", addingSalesRecords)

    document.getElementById("dashboardBtn").addEventListener("click", showDashBoard)

    document.getElementById("salesFormBtn").addEventListener("click", makeReadyForInsertSalesRecords)

    function fetchDatesArray() {
        return JSON.parse(localStorage.getItem("dates"))
    }

    function createTodayRecords() {
        let datesArray = []
        // if datesArrayString is empty
        if (!fetchDatesArray()) {
            datesArray.push(currentDate)
            localStorage.setItem("dates", JSON.stringify(datesArray))
            makeReadyForInsertSalesRecords()
            return;
        }

        datesArray = fetchDatesArray();

        if (!datesArray.includes(currentDate)) {
            datesArray.push(currentDate)
            localStorage.setItem("dates", JSON.stringify(datesArray))
            makeReadyForInsertSalesRecords()
            return;
        }

        showSalesRecords(currentDate)
    }

    function makeReadyForInsertSalesRecords() {
        hero.style.display = "none";
        salesCostRecords.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        addRecord.style.display = "block";
    }

    function showSalesRecords(date) {
        const tableBody = document.getElementById("tableBody")

        hero.style.display = "none";
        addRecord.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        document.getElementById("date").innerText = date;

        let salesRecordsArray = fetchSalesRecords(date)
        console.log(salesRecordsArray)
        let totalSelling = 0, totalProfit = 0;

        if (salesRecordsArray) {
            for (const record of salesRecordsArray) {
                let tableRow = document.createElement("tr");
                tableRow.innerHTML = `<td>${record.productName}</td>
                            <td>${record.buyingPrice}</td>
                            <td>${record.sellingPrice}</td>
                            <td class="profit">${record.profit}</td>
                            <td><button class="icon-btn edit">✏️</button></td>
                            <td><button class="icon-btn delete">🗑️</button></td>`
                tableBody.appendChild(tableRow)
                totalSelling += Number(record.sellingPrice);
                totalProfit += Number(record.profit);
            }
        }
        console.log(totalSelling+" "+totalProfit)
        totalSellingObj.textContent = totalSelling;
        totalProfitObj.textContent = totalProfit;

        salesCostRecords.style.display = "block";
    }

    function fetchSalesRecords(date) {
        return JSON.parse(localStorage.getItem(date));
    }

    function showDashBoard() {
        hero.style.display = "none";
        addRecord.style.display = "none";
        costForm.style.display = "none";
        salesCostRecords.style.display = "none";

        dashboardList.style.display = "block";
    }

    function addingRowsInSalesForm() {
        const SalesFormFooter = document.getElementById("sales-form-footer")
        const salesFields = document.querySelector(".salesFields");
        const newSalesFields = salesFields.cloneNode(true);
        for (const element of newSalesFields.querySelectorAll("input")) {
            element.value = "";
        }

        salesFields.parentNode.insertBefore(newSalesFields, SalesFormFooter)
    }

    function addingSalesRecords(e) {
        e.preventDefault()
        const allSalesFields = document.querySelectorAll(".salesFields")

        let salesRecordsArray = fetchSalesRecords()

        if (!salesRecordsArray) {
            salesRecordsArray = []
        }

        for (const salesFields of allSalesFields) {

            const productName = salesFields.querySelector('input[placeholder="Product name"]').value;
            const buyingPrice = salesFields.querySelector('input[placeholder="Buying price"]').value;
            const sellingPrice = salesFields.querySelector('input[placeholder="Selling price"]').value;

            salesRecordsArray.push({
                "productName": productName,
                "buyingPrice": buyingPrice,
                "sellingPrice": sellingPrice,
                "profit": sellingPrice - buyingPrice
            })

            localStorage.setItem(currentDate, JSON.stringify(salesRecordsArray))
        }

        showSalesRecords(currentDate)
    }



})()

// localStorage.clear()




