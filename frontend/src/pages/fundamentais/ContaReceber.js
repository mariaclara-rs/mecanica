import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import AreaSearch from '../../components/AreaSearch';
import BtAdicionar from '../../components/BtAdicionar';
import Form from '../../components/Form';
import Select from '../../components/Select';
import ToastMessage from '../../components/ToastMessage';

import { DadosContext } from '../../context/DadosContext';
import { UtilsContext } from '../../context/UtilsContext'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { FiTrash, FiEdit, FiCheckCircle } from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi'


function ContaReceber() {
    const [cr, serCR] = useState([])
    const [modalQuitar, setModalQuitar] = useState(false);

    const [numOS, setNumOS] = useState("");
    const [cliente, setCliente] = useState("");
    const [divOrig, setDivOrig] = useState("");
    const [divRest, setDivRest] = useState("");

    const [crAtual, setCrAtual] = useState("");
    const [valReceb, setValReceb] = useState("");
    const [dtReceb, setDtReceb] = useState("");
    const [metodoReceb, setMetodoReceb] = useState("");
    const [valRest, setValRest] = useState("");
    const [dtProxReceb, setDtProxReceb] = useState("");

    const [toast, setToast] = useState(false);
    const [classeToast, setClasseToast] = useState();
    const [msgToast, setMsgToast] = useState("");

    const schema = yup.object({
        valReceb: yup.string().required("Informe o valor"),
        dtReceb: yup.string().required("Informe a data"),
        metodoReceb: yup.string().required("Selecione um método")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, reset, formState: { errors, isValid } } = useForm({
        mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema),
    });

    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, toastComponent } = useContext(UtilsContext)

    useEffect(() => {
        carregarCR();
    }, []);
    useEffect(() => {
        setValRest(divRest - valReceb);
    }, [valReceb]);

    async function carregarCR() {
        const resp = await api.get('/contareceber');
        console.log(JSON.stringify(resp.data))
        serCR(resp.data)
    }
    function formatarData(data) {
        data = data.split('-')
        return data[2] + '/' + data[1] + '/' + data[0]
    }
    async function quitar(conta, i) {
        clearErrors();
        limparCampos();
        setNumOS(conta.os_id);
        setCliente(conta.cli_nome);
        setDivOrig(conta.os_valFiado);
        setDivRest(conta.cr_valor);
        setCrAtual(conta);
    }
    async function confirmaQuitar(e) {
        e.preventDefault();
        console.log("confirmado");
        if (valReceb == "" || dtReceb == "" || metodoReceb == "")
            alerta('mensagemForm mensagemForm-Erro', 'Preencha os campos obrigatórios!');
        else if (valRest != "" && dtProxReceb == "")
            alerta('mensagemForm mensagemForm-Erro', 'Informe a data do próximo recebimento!');
        else {
            const resp = await api.put('/contareceber', {
                cr_id: crAtual.cr_id,
                os_id: crAtual.os_id,
                cr_dtVenc: (crAtual.cr_dtVenc.split('T'))[0],
                cr_dtReceb: dtReceb,
                cr_metodoReceb: metodoReceb,
                cr_valor: crAtual.cr_valor,
                cr_valorReceb: valReceb
            });
            console.log(JSON.stringify(resp.data))
            if (resp.data.status) {
                if (valRest != "" && valRest > 0) {
                    const resp2 = await api.post('/contareceber/completo', {
                        os_id: crAtual.os_id,
                        cr_dtVenc: dtProxReceb,
                        cr_dtReceb: null,
                        cr_metodoReceb: null,
                        cr_valor: valRest,
                        cr_valorReceb: null
                    })
                    if (resp2.data.status) {
                        setModalQuitar(false);
                        personalizarToast(true,"Success","Recebimento registrado com sucesso!");
                    }
                    else{
                        setModalQuitar(false);
                        personalizarToast(false,"Danger","Erro ao registrar recebimento!");
                    }
                }
                else {
                    setModalQuitar(false);
                    personalizarToast(true,"Success","Recebimento registrado com sucesso!");
                }
            }
            else{
                setModalQuitar(false);
                personalizarToast(false,"Danger","Erro ao registrar recebimento!");
            }
            carregarCR();   
        }
    }
    function personalizarToast(status, classe, msg){
        setToast(status);
        setClasseToast(classe);
        setMsgToast(msg);
    }
    function limparCampos(){
        setCliente("");
        setDivOrig("");
        setDivRest("");
        setValReceb("");
        setValue("valReceb","");
        setDtReceb("");
        setValue("dtReceb","");
        setMetodoReceb("");
        setValue("metodoReceb","");
        setValRest(0);
        setDtProxReceb("");
        setNumOS("");
    }
    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Contas a Receber  <BiMoney style={{ color: '#231f20' }} /></h2>
                        <div className="line"></div>
                        {/*<BtAdicionar />*/}
                        <AreaSearch placeholder="Digite aqui..." />

                        <table className="table table-hover" style={{ overflow: 'auto' }} >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Ordem de Serviço</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Veículo</th>
                                    <th scope="col">Valor</th>
                                    <th scope="col">Data de Vencimento</th>
                                    <th scope="col">Observações</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cr.map((c, i) => (
                                    (c.cr_dtReceb==null) &&
                                        <tr key={i}>
                                            <th scope="row">{c.cr_id}</th>
                                            <td>{c.os_id}</td>
                                            <td>{c.cli_nome}</td>
                                            <td>{c.ve_placa}</td>
                                            <td>{c.cr_valor}</td>
                                            <td>{formatarData(c.cr_dtVenc.split('T')[0])}</td>
                                            <td>{c.os_observacoes.substring(0, 30)}{(c.os_observacoes).length > 30 && "..."}</td>
                                            <td>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Quitar"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiCheckCircle style={{ color: '#231f20' }} onClick={() => { quitar(c, i); setModalQuitar(true); }} />
                                                </Button>
                                                <Button className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiEdit style={{ color: '#231f20' }} />
                                                </Button>
                                                <Button
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiTrash style={{ color: '#231f20' }} />
                                                </Button>
                                            </td>
                                        </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <>
                <Modal className="col-md-12" show={modalQuitar} onHide={() => { setModalQuitar(false) }}>
                    <Modal.Header className='modal-title' closeButton style={{ letterSpacing: '0.05em' }}>
                        Quitar Recebimento <FiCheckCircle style={{ color: '#231f20' }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="container">
                                <div className='mb-2' style={{ fontWeight: 500 }}>Dados da Conta</div>
                                <div className="row secaoItensEstatico g-2" >
                                    <label className='col-md-6'>
                                        <b>O.S. #{numOS}</b>
                                    </label>
                                    <Form.Input disabled type="text" cols="col-md-12" id="cliente" name="cliente"
                                        label="Cliente" value={cliente} />
                                    <Form.Input disabled type="text" cols="col-md-6" id="divOrig" name="divOrig"
                                        label="Dívida Original (R$)" value={divOrig} />
                                    <Form.Input disabled type="text" cols="col-md-6" id="divRest" name="divRest"
                                        label="Dívida Restante (R$)" value={divRest} />
                                </div>
                            </div>
                            <Form.Input type="number" cols="col-md-6" id="valReceb" name="valReceb"
                                label="Valor Recebido (R$)" value={valReceb}
                                onChange={(e) => {
                                    setValReceb(e.target.value); setValue("valReceb", e.target.value);
                                    errors.valReceb && trigger('valReceb');
                                }}
                                register={register} erro={errors.valReceb} />
                            <Form.Input type="date" cols="col-md-6"
                                id="dtReceb" name="dtReceb" label="Data de Recebimento" value={dtReceb}
                                onChange={(e) => {
                                    setDtReceb(e.target.value); setValue("dtReceb", e.target.value);
                                    errors.dtReceb && trigger('dtReceb')
                                }}
                                register={register} erro={errors.dtReceb} />
                            <Select cols="col-md-6" id="metodoReceb" label="Método de Recebimento" register={register}
                                value={metodoReceb} onChange={e => {
                                    setMetodoReceb(e.target.value);
                                    setValue("metodoReceb", e.target.value); errors.metodoReceb && trigger('metodoReceb')
                                }}
                                erro={errors.metodoReceb}>
                                <option value={"CC"}>Cartão de Crédito</option>
                                <option value={"CD"}>Cartão de Débito</option>
                                <option value={"D"}>Dinheiro</option>
                                <option value={"C"}>Cheque</option>
                                <option value={"P"}>PIX</option>
                            </Select>
                            <div className="container">
                                <div className='mb-2' style={{ fontWeight: 500 }}></div>
                                <div className="row secaoItensEstatico g-2" >
                                    <Form.Input type="number" cols="col-md-6" id="valRest" name="valRest"
                                        label="Valor Restante (R$)" value={valRest}
                                        onChange={(e) => { setValRest(e.target.value) }} />
                                    <Form.Input type="date" cols="col-md-6"
                                        id="dtProxReceb" name="dtProxReceb" label="Próximo Recebimento" value={dtProxReceb}
                                        onChange={(e) => { setDtProxReceb(e.target.value) }} />
                                </div>
                            </div>
                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setModalQuitar(false); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(confirmaQuitar(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <ToastMessage show={toast} titulo="Conta a receber" onClose={()=>setToast(false)} 
                classes={classeToast} msg={msgToast}/>
        </>
    )
}
export default ContaReceber;