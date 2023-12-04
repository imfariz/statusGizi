const bornConverting = age => { 
    // Calculate milliseconds
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    const bornDate = new Date(age);
    const dateNow = Date.now();
    const bornMonth = bornDate.getTime();

    const months = Math.floor((dateNow - bornMonth)/month)
    return months;
}

const heightConverting = (height) => {
    const converted = parseFloat(height);
    let decimal = (converted - parseInt(converted, 10));
    decimal = Math.round(decimal * 10);
    if (decimal == 5) { return (parseInt(converted, 10)+0.5); }
    if ( (decimal < 3) || (decimal > 7) ) {
        return Math.round(converted);
    } else {
        return (parseInt(converted, 10)+0.5);
    }
}

const zscoring = (denominator, divider) => {
    return denominator/divider;
}

export { bornConverting, heightConverting, zscoring };
