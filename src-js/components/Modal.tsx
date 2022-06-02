import React, { FC, ReactNode } from 'react'

interface ModalProps {
  title: string
  body: ReactNode
  buttons: ReactNode
}

const Modal: FC<ModalProps> = ({ title, body, buttons }) => {
  return (
    <div className='modal' tabIndex={ -1 } style={ { display: 'block', background: 'rgba(0, 0, 0, .4)' } }>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{ title }</h5>
          </div>
          <div className='modal-body'>
            { body }
          </div>
          <div className='modal-footer'>
            { buttons }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal