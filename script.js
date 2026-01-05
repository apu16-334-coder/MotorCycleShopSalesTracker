(function() { 
    /* code */ 
    // All the Dom Content Object
    const hero = document.querySelector(".hero")
    const addRecord = document.querySelector(".add-record")
    const salesCostRecords = document.querySelector(".sales-cost-records")
    const dashboardList = document.querySelector(".dashboard-list")
    const costForm = document.querySelector(".cost-form")
    
    document.getElementById("startToday").addEventListener("click",createTodayRecords)

    document.getElementById("btnDashboard").addEventListener("click", showDashBoard)

    function createTodayRecords(){
        let currentDate = new Date().toLocaleDateString();
        let datesArrayString = localStorage.getItem("dates")
        let datesArray = []
        // if datesArrayString is empty
        if(!datesArrayString){           
            datesArray.push(currentDate)
            localStorage.setItem("dates", JSON.stringify(datesArray))
            makeReadyForInsertSalesRecords()           
            return;
        }

        datesArray = JSON.parse(datesArrayString);

        if(!datesArray.includes(currentDate)) {
            console.log("no")
            datesArray.push(currentDate)
            localStorage.setItem("dates", JSON.stringify(datesArray))
            makeReadyForInsertSalesRecords()
            return;
        }

        console.log("yes")
        showSalesRecords()
    }

    function makeReadyForInsertSalesRecords() {
        hero.style.display = "none";
        salesCostRecords.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        addRecord.style.display = "block";
    }

    function showSalesRecords() {
        hero.style.display = "none";
        addRecord.style.display = "none";
        dashboardList.style.display = "none";
        costForm.style.display = "none";

        salesCostRecords.style.display = "block";
    }

    function showDashBoard() {
        hero.style.display = "none";
        addRecord.style.display = "none";        
        costForm.style.display = "none";
        salesCostRecords.style.display = "none";

        dashboardList.style.display = "block";
    }

    

})()

localStorage.clear()



