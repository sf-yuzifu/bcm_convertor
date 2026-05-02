import swal from 'sweetalert'

const buildButtons = ({ buttonText = '关闭', actionButtonText } = {}) => {
  if (!actionButtonText) {
    return false
  }

  return {
    action: {
      text: actionButtonText,
      value: 'action',
      visible: true,
      className: 'swal-action-button'
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
