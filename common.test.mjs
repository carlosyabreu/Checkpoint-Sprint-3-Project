import { 
    getDateForDay, 
    getMonthIndex, 
    getDayOfWeekIndex,
    getDaysInMonth,
    getFirstDayOfMonth,
    generateDatesForDay,
    formatDateYYYYMMDD,
    formatDateYYYY_MM_DD
} from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("getMonthIndex returns correct index", () => {
    assert.equal(getMonthIndex('January'), 0);
    assert.equal(getMonthIndex('December'), 11);
    assert.equal(getMonthIndex('October'), 9);
});

test("getDayOfWeekIndex returns correct index", () => {
    assert.equal(getDayOfWeekIndex('Sunday'), 0);
    assert.equal(getDayOfWeekIndex('Saturday'), 6);
    assert.equal(getDayOfWeekIndex('Tuesday'), 2);
});

test("getDaysInMonth returns correct number of days", () => {
    assert.equal(getDaysInMonth(2024, 0), 31); // January
    assert.equal(getDaysInMonth(2024, 1), 29); // February (leap year)
    assert.equal(getDaysInMonth(2024, 3), 30); // April
    assert.equal(getDaysInMonth(2023, 1), 28); // February (non-leap year)
});

test("getFirstDayOfMonth returns correct day of week", () => {
    assert.equal(getFirstDayOfMonth(2024, 9), 2); // October 2024 starts on Tuesday
    assert.equal(getFirstDayOfMonth(2020, 9), 4); // October 2020 starts on Thursday
});

test("getDateForDay - Ada Lovelace Day (October second Tuesday)", () => {
    const day = {
        name: "Ada Lovelace Day",
        monthName: "October",
        dayName: "Tuesday",
        occurrence: "second"
    };
    
    // Test 2024
    const date2024 = getDateForDay(day, 2024);
    assert.equal(date2024.getFullYear(), 2024);
    assert.equal(date2024.getMonth(), 9); // October
    assert.equal(date2024.getDate(), 8);
    assert.equal(date2024.getDay(), 2); // Tuesday
    
    // Test 2025
    const date2025 = getDateForDay(day, 2025);
    assert.equal(date2025.getFullYear(), 2025);
    assert.equal(date2025.getMonth(), 9);
    assert.equal(date2025.getDate(), 14);
    assert.equal(date2025.getDay(), 2);
});

test("getDateForDay - World Lemur Day (October last Friday)", () => {
    const day = {
        name: "World Lemur Day",
        monthName: "October",
        dayName: "Friday",
        occurrence: "last"
    };
    
    // Test 2024
    const date2024 = getDateForDay(day, 2024);
    assert.equal(date2024.getFullYear(), 2024);
    assert.equal(date2024.getMonth(), 9);
    assert.equal(date2024.getDate(), 25);
    assert.equal(date2024.getDay(), 5); // Friday
    
    // Test 2020
    const date2020 = getDateForDay(day, 2020);
    assert.equal(date2020.getFullYear(), 2020);
    assert.equal(date2020.getMonth(), 9);
    assert.equal(date2020.getDate(), 30);
    assert.equal(date2020.getDay(), 5);
});

test("getDateForDay - International Binturong Day (May second Saturday)", () => {
    const day = {
        name: "International Binturong Day",
        monthName: "May",
        dayName: "Saturday",
        occurrence: "second"
    };
    
    // Test 2030
    const date2030 = getDateForDay(day, 2030);
    assert.equal(date2030.getFullYear(), 2030);
    assert.equal(date2030.getMonth(), 4); // May
    assert.equal(date2030.getDate(), 11);
    assert.equal(date2030.getDay(), 6); // Saturday
});

test("generateDatesForDay generates correct number of dates", () => {
    const day = {
        name: "Ada Lovelace Day",
        monthName: "October",
        dayName: "Tuesday",
        occurrence: "second"
    };
    
    const dates = generateDatesForDay(day, 2020, 2030);
    assert.equal(dates.length, 11); // 2020-2030 inclusive
    assert.equal(dates[0].getFullYear(), 2020);
    assert.equal(dates[10].getFullYear(), 2030);
});

test("formatDateYYYYMMDD returns correct format", () => {
    const date = new Date(2024, 9, 8); // October 8, 2024
    assert.equal(formatDateYYYYMMDD(date), "20241008");
    
    const date2 = new Date(2020, 0, 5); // January 5, 2020
    assert.equal(formatDateYYYYMMDD(date2), "20200105");
});

test("formatDateYYYY_MM_DD returns correct format", () => {
    const date = new Date(2024, 9, 8);
    assert.equal(formatDateYYYY_MM_DD(date), "2024-10-08");
});
