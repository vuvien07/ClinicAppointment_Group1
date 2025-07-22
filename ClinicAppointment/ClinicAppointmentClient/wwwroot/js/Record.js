async function changeRecordLimit(e) {
    e.preventDefault();
    filterCall.limit = parseInt(e.target.value) || 15;
    isLoadedRecord = false;
    await fetchAllCallHistory(e);
}
async function clickPreviousRecordPage(e) {
    e.preventDefault();
    filterCall.page  > 1 ? filterCall.page -= 1 : filterCall.page = 1;
    isLoadedRecord = false;
    await fetchAllCallHistory(e);
}
async function clickNextRecordPage(e) {
    e.preventDefault();
    filterCall.page += 1;
    isLoadedRecord = false;
    await fetchAllCallHistory(e);
}
