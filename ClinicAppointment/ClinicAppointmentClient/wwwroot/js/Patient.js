async function changeGender(e) {
    e.preventDefault();
    filterpatientSchedule.gender = e.target.value || '';
    await fetchAllPatientSchedule(e);
}
async function changePhongKham(e) {
    e.preventDefault();
    filterpatientSchedule.clinicId = parseInt(e.target.value) || 0;
    await fetchAllPatientSchedule(e);
}
async function clickSearch(e) {
    e.preventDefault();
    let value = document.querySelector('input[name="searchString"]').value;
    filterpatientSchedule.keyword = value || '';
    await fetchAllPatientSchedule(e);
}
async function clickPrevious(e) {
    e.preventDefault();
    filterpatientSchedule.page -= 1;
    if (filterpatientSchedule.page < 1) filterpatientSchedule.page = 1;
    await fetchAllPatientSchedule(e);
}
async function clickNext(e) {
    e.preventDefault();
    filterpatientSchedule.page += 1;
    if (filterpatientSchedule.page > totalFilterSchedulePage) filterpatientSchedule.page = totalFilterSchedulePage;
    await fetchAllPatientSchedule(e);
}
async function changeRowsPerPage(event) {
    event.preventDefault();
    filterpatientSchedule.pageSize = parseInt(event.target.value) || 15;
    await fetchAllPatientSchedule(event);
}
async function changeStartDate(event) {
    event.preventDefault();
    filterpatientSchedule.startDate = event.target.value || '';
    await fetchAllPatientSchedule(event);
}
async function changeEndDate(event) {
    event.preventDefault();
    filterpatientSchedule.endDate = event.target.value || '';
    await fetchAllPatientSchedule(event);
}