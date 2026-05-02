import swal from 'sweetalert'

const buildButtons = ({ buttonText = '关闭', actionButtonText } = {}) => {
  if (!actionButtonText) {
    return false
  }

  return {
    action: {
      text: actionButtonText,
      value: 'action',
      visible: true
    }
  }
}

export const showAlert = (title, text, options = {}) =>
  swal({
    title,
    text,
    buttons: buildButtons(options),
    dangerMode: options.dangerMode
  })
