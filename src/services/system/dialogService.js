import swal from 'sweetalert'

export const showAlert = (title, text) =>
  swal({
    title,
    text,
    buttons: false
  })
