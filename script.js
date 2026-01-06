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


    document.getElementById("startToday").addEventListener("click", createTodayRecords)

    document.getElementById("btnDashboard").addEventListener("click", showDashBoard)

    document.getElementById("addSalesFields").addEventListener("click", addingRowsInSalesForm)

    document.getElementById("dailyRecordForm").addEventListener("submit", addingSalesRecords)

    function createTodayRecords() {
        let datesArrayString = localStorage.getItem("dates")
        let datesArray = []
        // if datesArrayString is empty
        if (!datesArrayString) {
            datesArray.push(currentDate)
            localStorage.setItem("dates", JSON.stringify(datesArray))
            makeReadyForInsertSalesRecords()
            return;
        }

        datesArray = JSON.parse(datesArrayString);

        if (!datesArray.includes(currentDate)) {
            console.log("no")
            datesArray.push(currentDate)
            localStorage.setItem("dates", JSON.stringify(datesArray))
            makeReadyForInsertSalesRecords()
            return;
        }

        console.log("yes")
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

        for (const record of salesRecordsArray) {
            let tableRow = document.createElement("tr");
            tableRow.innerHTML =`<td>${record.productName}</td>
                            <td>${record.buyingPrice}</td>
                            <td>${record.sellingPrice}</td>
                            <td class="profit">${record.profit}</td>
                            <td><button class="icon-btn edit">✏️</button></td>
                            <td><button class="icon-btn delete">🗑️</button></td>`
            tableBody.appendChild(tableRow)                            
        }
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


    function addingSalesRecords() {
        console.log("hello")
        event.preventDefault()
        const allSalesFields = document.querySelectorAll(".salesFields")

        let salesRecordsArray = []
        let salesRecordsArrayString = localStorage.getItem(currentDate)

        if(salesRecordsArrayString){
            salesRecordsArray = JSON.parse(salesRecordsArrayString)
        }

        for (const salesFields of allSalesFields) {
            
            const productName = salesFields.querySelector('input[placeholder="Product name"]').value;
            const buyingPrice = salesFields.querySelector('input[placeholder="Buying price"]').value;
            const sellingPrice = salesFields.querySelector('input[placeholder="Selling price"]').value;

            salesRecordsArray.push({
                "productName" : productName,
                "buyingPrice" : buyingPrice,
                "sellingPrice" : sellingPrice,
                "profit" : sellingPrice-buyingPrice
            })

            localStorage.setItem(currentDate, JSON.stringify(salesRecordsArray))
        }

        showSalesRecords(currentDate)
    }



})()

localStorage.clear()



