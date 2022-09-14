import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../style.css'

export default function ModalExcluir({ onClickCancel, onClickSim, classesMsg, msg, item, valor, show, onHide}) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header className='modal-title' closeButton><Modal.Title>⚠️</Modal.Title></Modal.Header>
            <Modal.Body>
                <b style={{ color: 'red' }}>Excluir</b> {item} <b>{valor}</b>?
                {msg != '' && <p className={classesMsg}> {msg} </p>}
            </Modal.Body>

            <Modal.Footer>
                {/*<Button variant="secondary" onClick={onClickCancel}>
                    Cancelar
    </Button>*/}
                <Button type="submit" variant="danger" onClick={onClickSim}>
                    Sim
                </Button>
            </Modal.Footer>
        </Modal>
    )
}