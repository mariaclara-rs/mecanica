import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalExcluir.css'
import { FiTrash, FiEdit } from 'react-icons/fi';

export default function ModalExcluir({ onClickCancel, onClickSim, classesMsg, msg, item, valor, show, onHide, size="sm"}) {
    return (
        <Modal size={size} show={show} onHide={onHide}>
            <Modal.Header className='modal-title'><FiTrash size={25}/></Modal.Header>
            <Modal.Body>
            <b style={{ color: 'red' }}>Excluir</b> {item} <b>{valor}</b>?
            </Modal.Body>

            <Modal.Footer>
                {/*<Button variant="secondary" onClick={onClickCancel}>
                    Cancelar
                </Button>*/}
                <Button type="submit" variant="secondary" className='btn-sm' onClick={onHide}>
                    Não
                </Button>
                <Button type="submit" variant="danger" className='btn-sm' onClick={onClickSim}>
                    Sim
                </Button>
                
            </Modal.Footer>
        </Modal>
    )
}