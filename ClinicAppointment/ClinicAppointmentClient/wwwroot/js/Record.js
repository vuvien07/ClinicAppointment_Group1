async function changeRecordLimit(e) {
    e.preventDefault();
    filterCall.limit = parseInt(e.target.value) || 15;
    isLoadedRecord = false;
    await fetchAllCallHistory(e);
}