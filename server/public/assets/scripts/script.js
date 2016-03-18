$(document).ready(function() {
  console.log('hi');
  $('#employeeForm').on('submit', employeeSend);
});

function employeeSend (event){
  event.preventDefault();
  console.log('made it into employeeSend function');

  var formData = {};

  var formArray = $('#employeeForm').serializeArray();
  $.each(formArray, function (index, element){
    formData[element.name] = element.value;
  });
  $.ajax({
    type: 'POST',
    url:  '/employees',
    data: formData,
    success: employeeAppendDom
  });
}
function employeeAppendDom(employeeArray){
  console.log('inside employeeAppendDom after GET call' ,employeeArray);
  for (var i = 0; i < employeeArray.length; i++) {
    $('.employeeOnDom').append('<h3>' + employeeArray[i].first_name + ' ' + employeeArray[i].last_name + '</h3>');
    $('.employeeOnDom').append('<li>' + employeeArray[i].employee_id + '</li>');
    $('.employeeOnDom').append('<li>' + employeeArray[i].job_title + '</li>');
    $('.employeeOnDom').append('<li>' + employeeArray[i].salary + '</li>');

  }
}
