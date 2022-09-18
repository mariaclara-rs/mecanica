import React, { useEffect, useState } from 'react';
import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import AreaSearch from '../../components/AreaSearch';
import BtAdicionar from '../../components/BtAdicionar';
import Form from '../../components/Form';
import Select from '../../components/Select';

import { FiTrash, FiEdit } from 'react-icons/fi';
import { RiWallet3Line } from 'react-icons/ri';
import {BsPlusLg} from 'react-icons/bs';

function ContaPagar() {

    const [modal, setModal] = useState(false)
    const [add, setAdd] = useState(true)

    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Contas a Pagar  <RiWallet3Line style={{ color: '#231f20' }} /></h2>
                        <div className="line"></div>
                        <BtAdicionar onClick={() => { setAdd(true); setModal(true); }} />
                        <AreaSearch placeholder="Digite aqui..." />

                        <table className="table table-hover" style={{ overflow: 'auto' }} >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tipo de Despesa</th>
                                    <th scope="col">Situação</th>
                                    <th scope="col">Quantidade de Parcelas</th>
                                    <th scope="col">Valor</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <>
                <Modal className="col-md-12" show={modal} onHide={() => { setModal(false) }}>
                    <Modal.Header className='modal-title' closeButton style={{ letterSpacing: '0.03em' }}>
                        {add ? "Registrar Conta a Pagar" : "Editar Conta a Pagar"}&nbsp;<RiWallet3Line style={{ color: '#231f20' }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Select cols="col-md-6" id="tdId" label="Tipo de Despesa" register={null} value=""
                                onChange={e => { }}
                                erro={null}>
                            </Select>
                            <Select cols="col-md-6" id="distId" label="Distribuidora" register={null} value=""
                                onChange={e => { }}
                                erro={null}>
                            </Select>
                            <div className="container">
                                <div id="title">Peças</div>
                                <div className="row secaoItens">
                                    <Button className='btnMais m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { }}>
                                        <BsPlusLg size={14} style={{ color: '#000' }} />
                                    </Button>
                                    <Select cols="col-md-6" id="pecId" label="Nome" register={null} value=""
                                        onChange={e => {  }}>

                                    </Select>
                                    <Form.Input type="number" min="0" cols="col-md-2" id="pecQtde" name="pecQtde" placeholder=""
                                        label="Qtde." register={null} value=""
                                        onChange={e => { }} />
                                    <Form.Input type="number" min="0" cols="col-md-4" id="pecValor" name="pecValor" placeholder=""
                                        label="Valor (R$)" register={null} value=""
                                        onChange={e => { }} />

                                    
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setModal(false); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        </>
    )
}
export default ContaPagar;