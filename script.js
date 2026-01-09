(function () {
    /* code */
    // All the Dom Content Object
    const hero = document.querySelector(".hero")
    const addRecord = document.querySelector(".add-record")
    const salesCostRecords = document.querySelector(".sales-cost-records")
    const dashboardList = document.querySelector(".dashboard-list")
    const costForm = document.querySelector(".cost-form")

    const salesFields = document.querySelector(".salesFields");


    // Today
    const currentDate = new Date().toLocaleDateString();
    // console.log(currentDate)


    // Statements object
    const totalSellingObj = document.querySelector(".TotalSelling")
    const totalProfitObj = document.querySelector(".TotalProfit")


    document.getElementById("startToday").addEventListener("click", createTodayRecords)

    document.getElementById("addSalesFields").addEventListener("click", addingRowsInSalesForm)


    document.getElementById("dailyRecordForm").addEventListener("submit", addingSalesRecords)

    document.querySelectorAll(".btnDashboard").forEach((element) => {
        element.addEventListener("click", showDashBoard);
    })

    document.querySelectorAll(".sales_records").forEach((element) => {
        element.addEventListener("click", () => {
            showSalesRecords(currentDate);
        })
    })

    document.getElementById("salesFormBtn").addEventListener("click", makeReadyForInsertSalesRecords)

    function fetchDatesArray() {
        return JSON.parse(localStorage.getItem("dates"))
    }

    function setDatesArray(datesArray) {
        localStorage.setItem("dates", JSON.stringify(datesArray))

    }

    function createTodayRecords() {
        let datesArray = []
        // if datesArrayString is empty
        if (!fetchDatesArray()) {
            datesArray.push(currentDate)
            setDatesArray(datesArray)
            makeReadyForInsertSalesRecords()
            return;
        }

        datesArray = fetchDatesArray();

        if (!datesArray.includes(currentDate)) {
            datesArray.push(currentDate)
            setDatesArray(datesArray)
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
        tableBody.innerHTML = "";

        hero.style.display = "none";
        addRecord.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        document.getElementById("date").innerText = date;

        let salesRecordsArray = fetchSalesRecords(date)
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
                tableRow.querySelector(".edit").addEventListener("click", editTheRecord)
                tableRow.querySelector(".delete").addEventListener("click", deleteTheRecord)

                totalSelling += Number(record.sellingPrice);
                totalProfit += Number(record.profit);
            })

        }
        console.log(totalSelling + " " + totalProfit)
        totalSellingObj.textContent = totalSelling;
        totalProfitObj.textContent = totalProfit;

        salesCostRecords.style.display = "block";
    }


    function editTheRecord(e) {
        console.log(e.target.dataset.index)
        let date = document.getElementById("date").textContent
        console.log(date)
        let dailyRecordsArray = fetchSalesRecords(date)
        console.log(dailyRecordsArray.splice(e.target.dataset.index, 1));
        console.log(dailyRecordsArray);
        dailyRecordsArray.forEach((record, i) => {
            appendTableRow(record, i);
        })

    }

    function deleteTheRecord(e) {
        console.log(e.target.dataset.index)
        let date = document.getElementById("date").textContent
        console.log(date)
        let dailyRecordsArray = fetchSalesRecords(date)
        console.log(dailyRecordsArray.splice(e.target.dataset.index, 1));
        console.log(dailyRecordsArray);
        dailyRecordsArray.forEach((record, i) => {
            appendTableRow(record, i);
        })
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
        const newSalesFields = makeNewSetOffSalesInputField() 
        makeSalesInputFieldEmpty(newSalesFields)
        salesFields.parentNode.insertBefore(newSalesFields, SalesFormFooter)
    }

    function makeSalesInputFieldEmpty(salesFieldsRow) {
        for (const element of salesFieldsRow.querySelectorAll("input")) {
            element.value = "";
        }
    }

    function makeNewSetOffSalesInputField() {       
        const newSalesFields = salesFields.cloneNode(true);       
        return newSalesFields;
    }

    function addingSalesRecords(e) {
        e.preventDefault()
        const allSalesFields = document.querySelectorAll(".salesFields")
        console.log("called adding sales records");
        

        let salesRecordsArray = fetchSalesRecords(currentDate)

        if (!salesRecordsArray) {
            salesRecordsArray = []
        }

        allSalesFields.forEach((salesField, i)=>{
            const productName = salesField.querySelector('input[placeholder="Product name"]').value;
            const buyingPrice = salesField.querySelector('input[placeholder="Buying price"]').value;
            const sellingPrice = salesField.querySelector('input[placeholder="Selling price"]').value;

            salesRecordsArray.push({
                "productName": productName,
                "buyingPrice": buyingPrice,
                "sellingPrice": sellingPrice,
                "profit": sellingPrice - buyingPrice
            })

            localStorage.setItem(currentDate, JSON.stringify(salesRecordsArray))
            if(allSalesFields.length-1 >i) {
                salesField.parentNode.removeChild(salesField);
            }else {
                makeSalesInputFieldEmpty(salesField);
            }
        })
        

        showSalesRecords(currentDate)
    }



})()

localStorage.clear()




