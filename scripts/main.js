
window.onload = function () {
  if (current_day < 10) current_day = "0" + current_day
  if (current_month < 10) current_month = "0" + current_month
  $("#input_date").val(current_year + "-" + current_month + "-" + current_day)

  const getTodo = window.localStorage.getItem($("#input_date").val())
  if (getTodo == null) {
    $("#todoreturn").val("")
  }
  else {
    const todoObj = JSON.parse(getTodo)
    $("#todoreturn").val(todoObj.content)
  }

  var latitude;
  var longitude;

  if (!navigator.geolocation) {
    throw "위치 정보가 지원되지 않습니다."
  }
  else {
    navigator.geolocation.getCurrentPosition(current)
  }

  function current({ coords }) {
    latitude = coords.latitude;
    longitude = coords.longitude;

    var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAmdcHSd-H0-Tgufv85nQO5bNYW-69Xw44&q=${latitude},${longitude}&zoom=11`
    $('.mainMap').attr('src', placeSrc)
  }

}

//진짜 현재 날짜
let current_day = (new Date()).getDate();
let current_month2 = (new Date()).getMonth();
let current_year2 = (new Date()).getFullYear();

function checkLeapYear(year) {
  if (year % 400 == 0) {
    return true
  } else if (year % 100 == 0) {
    return true
  } else if (year % 400 == 0) {
    return true
  } else {
    return false
  }
}

function getfirstDayOfWeek(year, month) {
  if (month < 10) month = "0" + month;

  return (new Date(year + "-" + month + "-01")).getDay();
}

function changeYearMonth(year, month) {
  let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (month == 2) {
    if (checkLeapYear(year)) month_day[1] = 29;
  }

  let first_day_of_week = getfirstDayOfWeek(year, month);
  let arr_calendar = []
  for (let i = 0; i < first_day_of_week; i++) {
    arr_calendar.push("")
  }
  for (let i = 0; i < month_day[month - 1]; i++) {
    arr_calendar.push(String(i + 1));
  }
  let remain_day = 7 - (arr_calendar.length % 7)
  if (remain_day < 7) {
    for (let i = 0; i < remain_day; i++) {
      arr_calendar.push("");
    }
  }
  renderCalendar(arr_calendar)
}

function renderCalendar(data) {
  let h = [];
  for (let i = 0; i < data.length; i++) {
    if (i == 0) {
      h.push('<tr>')
    } else if (i % 7 == 0) {
      h.push('</tr>')
      h.push('<tr>')
    }
    if (current_day == data[i] && (current_month2 + 1) == $('#month').val() && current_year2 == $('#year').val()) {
      h.push('<td class="non-click today" onclick="setDate(' + data[i] + ');" style="cursor:pointer; font-weight:bold; color:blue;">' + data[i] + '</td>')
    }
    else {
      h.push('<td class="non-click" onclick="setDate(' + data[i] + ');" style="cursor:pointer;">' + data[i] + '</td>')
    }
  }
  h.push('</tr>')
  $("#tb_body").html(h.join(""))
}

function setDate(day) {
  if (day < 10) day = "0" + day
  $("#input_date").val(current_year + "-"  +  current_month + "-" + day)

  //할일 출력 코드
  const getTodo = window.localStorage.getItem($("#input_date").val())
  if (getTodo == null) {
    $("#todoreturn").val("")
  }
  else {
    const todoObj = JSON.parse(getTodo)
    $("#todoreturn").val(todoObj.content)
  }

  //달력 일자 색깔 변경
  const nonClick = document.querySelectorAll('.non-click')

  function handleClick(event) {
    nonClick.forEach((e) => {
      e.classList.remove("click")
      e.style.backgroundColor = 'white'
    })

    event.target.classList.add("click")
    event.target.style.backgroundColor = 'red'
  }

  nonClick.forEach((e) => {
    e.addEventListener("click", handleClick)
  })
}

function changeMonth(diff) {
  if (diff == undefined) {
    current_month = parseInt($("#month").val());
  } else {
    current_month = current_month + diff;

    if (current_month == 0) {
      current_year = current_year - 1
      current_month = 12
    } else if (current_month == 13) {
      current_year = current_year + 1
      current_month = 1
    }
  }

  loadCalendar()
}

function changeYear() {
  current_year = parseInt($("#year").val())
  loadCalendar()
}

function loadCalendar() {
  $("#year").val(current_year)
  $("#month").val(current_month)
  changeYearMonth(current_year, current_month)
}

let current_year = (new Date()).getFullYear();
let current_month = (new Date()).getMonth() + 1;

$("#year").val(current_year)
$("#month").val(current_month)

changeYearMonth(current_year, current_month)


$("#save").click(() => {
  const todo = {
    time: $("#input_date").val(),
    content: $("#todo").val()
  }
  const todoObjString = JSON.stringify(todo)
  window.localStorage.setItem($("#input_date").val(), todoObjString)
})





