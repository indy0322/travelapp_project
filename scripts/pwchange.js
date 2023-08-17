
function cancel() {
  $('#currentPassword').val('')
  $('#changePassword').val('')
  $('#checkPassword').val('')
}

$('#change').click(() => {
  $.ajax({
    type: 'POST',
    url: '/changepw',
    data: {
      currentpw: $('#currentPassword').val(),
      changepw: $('#changePassword').val(),
      checkpw: $('#checkPassword').val()
    },
    success: function (data) {
      console.log(data)
    }
  })

  $('#currentPassword').val('')
  $('#changePassword').val('')
  $('#checkPassword').val('')
})
