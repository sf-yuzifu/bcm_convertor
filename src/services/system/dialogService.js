import swal from 'sweetalert'

export const showAlert = (title, text) =>
  swal({
    title,
    text,
    timer: 2000,
    buttons: false
  })
