import React from 'react'

const Modal = () => {
  return (
    <div id='classroom-change-confirmation-modal' className='modal' tabIndex={ -1 }>
      <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Confirmación de cambio de aula</h5>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>
            <p>Has seleccionado un aula que está siendo usada por</p>
            <p>Para añadir este aula</p>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
            <button type='button' className='btn btn-primary'>Cambiar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal