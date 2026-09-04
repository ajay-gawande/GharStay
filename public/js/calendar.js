document.addEventListener("DOMContentLoaded", () => {
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");



if (!checkIn || !checkOut) return;

function format(date) {
    return date.toISOString().split("T")[0];
}

function isBlocked(dateStr) {
    const d = new Date(dateStr);

    return bookedRanges.some(range => {
        const start = new Date(range.start);
        const end = new Date(range.end);
        return d >= start && d < end;
    });
}



/*  CHECK-IN LOGIC */
checkIn.addEventListener("change", () => {
    let date = new Date(checkIn.value);

    // Move to next available date if blocked                                                                                            
    while (isBlocked(format(date))) {
        date.setDate(date.getDate() + 1);
    }

    //  MUST update input itself
    checkIn.value = format(date);

    // Checkout must be after check-in
    checkOut.min = format(date);
    checkOut.value = "";
});

/*  CHECK-OUT LOGIC */
checkOut.addEventListener("change", () => {
    if (!checkIn.value) {
        alert("Please select check-in first");
        checkOut.value = "";
        return;
    }

    let date = new Date(checkIn.value);
    let end = new Date(checkOut.value);

    // Walk day-by-day from check-in to checkout
    while (date < end) {
        if (isBlocked(format(date))) {
            alert("Selected dates include unavailable days.");
            checkOut.value = "";
            return;
        }
        date.setDate(date.getDate() + 1);
    }
});

});