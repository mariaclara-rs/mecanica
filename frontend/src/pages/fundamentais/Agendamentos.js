import React, { useEffect, useState, useContext, useRef } from 'react';
import api from '../../services/api';
import '../../style.css'
import emailjs from '@emailjs/browser';

import { Button, Modal, ToastHeader } from 'react-bootstrap';
import ModalExcluir from '../../components/ModalExcluir';
import Sidebar from '../../components/Sidebar';
import AreaSearch from '../../components/AreaSearch';
import BtAdicionar from '../../components/BtAdicionar';
import Form from '../../components/Form';
import Select, { SelectReadOnly } from '../../components/Select';
import ToastMessage from '../../components/ToastMessage';

import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { DadosContext } from '../../context/DadosContext';
import { UtilsContext } from '../../context/UtilsContext';

import { BsClockHistory } from 'react-icons/bs'
import { FiTrash, FiEdit } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { VscSettingsGear } from 'react-icons/vsc'
import { BsEnvelope } from 'react-icons/bs'



function Agendamentos() {

    const [modal, setModal] = useState(false);
    const [modalOS, setModalOS] = useState(false);
    const [modalMsg, setModalMsg] = useState(false);
    const [modalExcluir, setModalExcluir] = useState();
    const [toast, setToast] = useState(false);
    const [classeToast, setClasseToast] = useState();
    const [msgToast, setMsgToast] = useState("");

    const [data, setData] = useState();
    const [horario, setHorario] = useState();
    const [cliId, setCliId] = useState();
    const [anotacoes, setAnotacoes] = useState();

    const [agendamentos, setAgendamentos] = useState([]);
    const [listaAg, setListaAg] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [veId, setVeId] = useState();

    const [ag, setAg] = useState();
    const [add, setAdd] = useState(true)
    const [lastId, setLastId] = useState(-1);
    const [agId, setAgId] = useState();

    const [nome, setNome] = useState();
    const [email, setEmail] = useState();
    const [mensagem, setMensagem] = useState();

    const { clis, carregarClis, servicos, carregarServicos, pecas, carregarPecas } = useContext(DadosContext)
    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, formatarDataParaUsuario, formatarHorarioParaUsuario } = useContext(UtilsContext)
    
    const schema = yup.object({
        data: yup.date().required("Campo obrigatório"),
        horario: yup.string().required("Campo obrigatório"),
        cliId: yup.string().required("Selecione um cliente"),
        veId: yup.string().required("Selecione um Veículo")
    }).required();
    const { register, handleSubmit, trigger, setValue, clearErrors, reset, formState: { errors, isValid } } = useForm({
        mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema),
    });

    const form = useRef();
    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm('service_zszoaqd', 'template_g0rldem', form.current, 'LuU_9qGcKTx1oeeTY')
            .then((result) => {
                alerta('mensagemForm mensagemForm-Sucesso', 'Email enviado!').then((resp) => { setModalMsg(false) });
            }, (error) => {
                console.log("erro: " + error.text);
            });
    };

    const handleBlur = async () => {
        //recuperar agendamentos do dia selecionado
        const params = {
            data
        };
        const resp = await api.get('/agenda/data', { params })
        setAgendamentos(resp.data)
    };

    async function agendar(e) {
        e.preventDefault();
        const ag = listaAg.filter(ag => (ag.cli_id == cliId && formatarHorarioParaUsuario(ag.horario) == horario))

        if (ag.length > 0)
            alerta('mensagemForm mensagemForm-Erro', 'Esse agendamento já foi realizado anterirmente!');
        else
            if (data != undefined && horario != undefined && cliId != null && veId != null) {
                if (isValid) {
                    if (add) {
                        const resp = await api.post('/agenda', {
                            ag_data: data + " " + horario,
                            ag_anotacoes: anotacoes,
                            cli_id: cliId,
                            ve_id: veId
                        });
                        if (resp.data.status) {
                            alerta('mensagemForm mensagemForm-Sucesso', 'Agendamento realizado!');
                            clearErrors();
                            limparCampos();
                            setLastId(resp.data.lastId)
                            carregarAgendamentos();
                        }
                        else
                            alerta('mensagemForm mensagemForm-Erro', 'Erro. Não foi possível realizar o agendamento!');
                    }
                    else {
                        const resp = await api.put('/agenda', {
                            ag_id: agId,
                            ag_data: data + " " + horario,
                            ag_anotacoes: anotacoes,
                            cli_id: cliId,
                            ve_id: veId
                        })
                        if (resp.data.status) {
                            alerta('mensagemForm mensagemForm-Sucesso', 'Agendamento editado!');
                            clearErrors();
                            limparCampos();
                            carregarAgendamentos();
                            setAdd(true)
                        }
                        else
                            alerta('mensagemForm mensagemForm-Erro', 'Erro. Não foi possível editar o agendamento!');
                    }
                }
                else
                    alerta('mensagemForm mensagemForm-Erro', 'Erro. Verifique os campos preenchidos!');
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Preencha todos os campos!');
            }

    }
    function limparCampos() {
        setValue("data", undefined)
        setData("");
        setValue("horario", undefined)
        setHorario("");
        setValue("cliId", undefined)
        setCliId();
        setValue("veId", undefined)
        setVeId();
        setValue("anotacoes", undefined)
        setAnotacoes("");
        setAgendamentos([])

    }
    function carregarCampos(ag) {
        setAgId(ag.ag_id)
        setValue("data", ag.data.split('T')[0])
        setData(ag.data.split('T')[0]);
        setValue("horario", ag.horario)
        setHorario(ag.horario);
        setValue("cliId", ag.cli_id)
        setCliId(ag.cli_id);
        setValue("veId", ag.ve_id)
        setVeId(ag.ve_id);
        setValue("anotacoes", ag.ag_anotacoes)
        setAnotacoes(ag.ag_anotacoes)
    }

    async function recuperarEmail(ag) {
        setNome(ag.cli_nome)
        setEmail(ag.cli_email)
        setMensagem("Olá, " + ag.cli_nome + "!\n\n" +
            "Você possui um agendamento na Oficina Mecânica Valter\nData: " +
            "" + formatarDataParaUsuario(ag.data.split('T')[0]) + " às " + formatarHorarioParaUsuario(ag.horario) + "h" +
            "\n\nAté lá 👋")
    }

    useEffect(() => {
        carregarClis();
        carregarAgendamentos();
    }, []);
    useEffect(() => {
        carregarVeiculos();
    }, [cliId])

    async function carregarAgendamentos() {
        const resp = await api.get('/agenda')
        setListaAg(resp.data)
    }

    async function gerarOS() {
        console.log("veId: " + veId + " ag.ve_id: " + ag.ve_id)
        await api.post('/ordemservico', {
            dataAbertura: (new Date()).toISOString().split('T')[0],
            ve_id: ag.ve_id,
            vekm: 0,
            valTot: 0,
            status: "A",
            observacoes: ""
        }).then((resp) => {
            if (resp.data.status)
                api.delete('/agenda/' + ag.ag_id).then((resp2) => {
                    if (resp2.data.status) {
                        alerta('mensagemForm mensagemForm-Sucesso', 'OS criada!').then(() => { setModalOS(false); });
                        carregarAgendamentos();
                    }
                    else
                        alerta('mensagemForm mensagemForm-Atencao', 'OS foi criada. No entanto, o agendamento não foi excluído!').then(() => { setModalOS(false); });;
                })
            else
                alerta('mensagemForm mensagemForm-Erro', 'Não foi possível gerar a OS no momento!').then(() => { setModalOS(false); });;
        })
    }

    async function carregarVeiculos() {
        const resp = await api.get('/veiculos/cliente/' + cliId)
        setVeiculos(resp.data.data)
    }

    async function excluirAgendamento() {
        const resp = await api.delete('/agenda/' + ag.ag_id)
        if (resp.data.status) {
            //alerta('mensagemForm mensagemForm-Sucesso', 'Agendamento excluído').then(() => { setModalExcluir(false); setAg(null); })
            setMsgToast("Agendamento excluído");
            setClasseToast('Success');
        }
        else {
            //alerta('mensagemForm mensagemForm-Erro', 'Erro. Não foi possível excluir o agendamento no momento').then(() => { setModalExcluir(false); setAg(null) })
            setMsgToast("Não foi possível excluir o agendamento no momento");
            setClasseToast('Danger');
        }
        setModalExcluir(false);
        setToast(true);
        carregarAgendamentos();
    }
    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Agendamentos <BsClockHistory style={{ color: '#231f20' }} /></h2>
                        <div className="line"></div>
                        <BtAdicionar onClick={() => { setAdd(true); setModal(true); limparCampos(); clearErrors(); }} />
                        <AreaSearch placeholder="Digite aqui..." />

                        <table className="table table-hover" style={{ overflow: 'auto' }} >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Horário</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Anotações</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaAg.map((ag, i) => (
                                    <tr key={i}>
                                        <th scope="row">{ag.ag_id}</th>
                                        <td>{formatarDataParaUsuario(ag.data.split('T')[0])}</td>
                                        <td>{formatarHorarioParaUsuario(ag.horario)}</td>
                                        <td>{ag.cli_nome}</td>
                                        <td>{ag.ag_anotacoes}</td>
                                        <td>
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { setAg(ag); setModalOS(true); }}>
                                                <VscSettingsGear style={{ color: '#231f20' }} />
                                            </Button>
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { setAg(ag); recuperarEmail(ag); setModalMsg(true); }}>
                                                <BsEnvelope style={{ color: '#231f20' }} />
                                            </Button>
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { clearErrors(); setAdd(false); setAg(ag); carregarCampos(ag); setModal(true); }}>
                                                <FiEdit className='btEditar' />
                                            </Button>

                                            <Button
                                                className='m-0 p-0 px-1 border-0 bg-transparent' >
                                                <FiTrash className='btExcluir' onClick={() => { setAg(ag); setModalExcluir(true); }} />
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
                <Modal className="col-md-12" show={modal} onHide={() => { setModal(false) }}>
                    <Modal.Header className='modal-title' closeButton style={{ letterSpacing: '0.05em' }}>{add ? "Agendar Serviços" : "Editar Agendamento"}<BsClockHistory style={{ color: '#231f20' }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Input type="date" min={(new Date()).toISOString().split('T')[0]} cols="col-md-6"
                                id="data" name="data" label="Informe a Data"
                                onBlur={handleBlur} register={register} value={data}
                                onChange={e => { setValue("data", e.target.value); setData(e.target.value); errors.data && trigger('data') }}
                                erro={errors.data} />
                            <Form.Input type="time" cols="col-md-6"
                                id="horario" name="horario" label="Informe o horário"
                                register={register} value={horario}
                                onChange={e => { setValue("horario", e.target.value); setHorario(e.target.value); errors.horario && trigger('horario') }}
                                erro={errors.horario} />
                            {agendamentos.length > 0 &&
                                <div className="container">
                                    <div id="title">Agendamentos para {data && formatarDataParaUsuario(data)}</div>
                                    <div className="row secaoItens" style={{ height: "7em" }}>
                                        {agendamentos.map((ag, i) => (
                                            <>
                                                <Form.InputRO disabled key={i} type="text" cols="col-md-8" value={ag.cli_nome}
                                                    id="cliente" name="cliente" label={i == 0 ? "Cliente" : ""} />
                                                <Form.InputRO disabled key={i} type="time" cols="col-md-4" value={ag.horario}
                                                    id="horario" name="horario" label={i == 0 ? "Horário" : ""} />
                                            </>
                                        ))}

                                    </div>
                                </div>
                            }
                            <Select cols="col-md-12" id="cliId" label="Cliente" register={register} value={cliId}
                                onChange={e => { setValue("cliId", e.target.value); setCliId(e.target.value); errors.cliId && trigger('cliId'); }}
                                erro={errors.cliId}>
                                {clis.map((cli, i) => (
                                    <option key={i} value={cli.cli_id}>{cli.cli_nome}</option>
                                ))}
                            </Select>
                            <Select cols="col-md-12" id="veId" label="Veículos" register={register} value={veId}
                                onChange={e => { setValue("veId", e.target.value); setVeId(e.target.value); errors.veId && trigger('veId'); }}
                                erro={errors.veId}>
                                {veiculos.map((ve, i) => (
                                    <option key={i} value={ve.ve_id}>{ve.ve_placa}</option>
                                ))}
                            </Select>
                            <Form.InputArea label="Anotações" id="anotacoes" name="anotacoes" value={anotacoes}
                                onChange={e => { setAnotacoes(e.target.value) }} />
                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setModal(false); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(agendar(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <>
                <Modal className="col-md-12" show={modalMsg} onHide={() => { setModalMsg(false) }}>
                    <Modal.Header className='modal-title' closeButton style={{ letterSpacing: '0.05em' }}>
                        Enviar E-mail &nbsp;<HiOutlineMail style={{ color: '#231f20' }} />
                    </Modal.Header>
                    <Modal.Body>
                        <form ref={form} className='row g-3' style={{ justifyContent: 'left' }} onSubmit={sendEmail}>
                            <Form.InputRO readOnly type="text" cols="col-md-6" id="email" name="nome" placeholder="" label="Nome do Cliente"
                                value={nome} onChange={(e) => { setNome(e.target.value) }} />
                            <Form.InputRO type="text" cols="col-md-6" id="email" name="email" placeholder="" label="Email do Cliente"
                                value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            <Form.InputArea label="Mensagem" id="mensagem" name="mensagem" value={mensagem}
                                onChange={(e) => { setMensagem(e.target.value) }} />
                            {msgForm != '' && <p className={classes}> {msgForm} </p>}
                            <div className="col-md-12">
                                <button type="submit" style={{ float: 'right' }} className='col-md-2 btn btn-dark'>Enviar</button>
                            </div>
                        </form>

                    </Modal.Body>
                </Modal>
            </>
            <>
                <Modal show={modalOS} onHide={() => { setModalOS(false) }}>
                    <Modal.Header className='modal-title' closeButton><Modal.Title>⚠️</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <b style={{ color: 'red' }}>Gerar OS para agendamento {ag && ag.ag_id} ?</b>
                        <p></p>
                        <b>Cliente: </b>{ag && ag.cli_nome} <br /> <b>Data: </b>{ag && formatarDataParaUsuario(ag.data.split('T')[0])} às {ag && formatarHorarioParaUsuario(ag.horario)}h
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>

                    <Modal.Footer>
                        {/*<Button variant="secondary" onClick={onClickCancel}>
                    Cancelar
                    </Button>*/}
                        <Button type="submit" variant="danger" onClick={() => { gerarOS() }}>
                            Sim
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            {ag != null &&
                <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                    item="Agendamento" valor={ag.ag_id} classesMsg={classes} msg={msgForm}
                    onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirAgendamento() }} />
            }
            <>
                <ToastMessage show={toast} titulo="Exclusão de Agendamento" onClose={()=>setToast(false)} 
                classes={classeToast} msg={msgToast}/>
            </>
        </>
    )
}

export default Agendamentos;