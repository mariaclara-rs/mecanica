import React, { useEffect, useState, useContext } from 'react';

import { UtilsContext } from '../../context/UtilsContext'

import api from '../../services/api';

import Sidebar from '../../components/Sidebar';
import Form from '../../components/Form'
import Search from '../../components/Search'
import { Button, Modal } from 'react-bootstrap';
import ModalExcluir from '../../components/ModalExcluir';
import BtSair from '../../components/BtSair';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { FiTrash, FiEdit, FiEye } from 'react-icons/fi';
import { BiBriefcaseAlt2 } from "react-icons/bi"

import ToastMessage from '../../components/ToastMessage';
import AreaSearch from '../../components/AreaSearch';

function Servico() {

    const [nome, setNome] = useState('');
    const [maoObra, setMaoObra] = useState('');
    const [descricao, setDesc] = useState('');
    const [servs, setServs] = useState([]);

    const [modal, setModal] = useState(false);
    const [add, setAdd] = useState(true);
    const [id, setId] = useState('');
    const [servTemp, setServTemp] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);

    const [campoBusca, setCampoBusca] = useState('');

    const [toast, setToast] = useState(false);
    const [classeToast, setClasseToast] = useState();
    const [msgToast, setMsgToast] = useState("");
    const [tituloToast, setTituloToast] = useState("");

    const [visualizar, setVisualizar] = useState(false);

    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, logout } = useContext(UtilsContext)

    const schema = yup.object({
        nome: yup.string().required("Informe o nome do serviço"),
        maoObra: yup.string().required("Informe a mão de obra")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    useEffect(() => {
        carregarServicos();

    }, []);

    async function carregarServicos() {
        const resp = await api.get('/servicos');
        if (campoBusca.length > 0)
            setServs(resp.data.filter(s => s.ser_nome.toUpperCase().includes(campoBusca.toUpperCase())))
        else
            setServs(resp.data);
    }

    async function gravarServico(e) {
        e.preventDefault();
        if (nome.length > 0 && maoObra > 0) {
            if (errors.nome == undefined && errors.maoObra == undefined) {
                let resp;
                if (add) {
                    resp = await api.post('/servicos/gravar', {
                        nome, maoObra, descricao
                    });
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar cadastrar serviço!');
                    }
                    else {
                        setToast(false);
                        setTituloToast("Cadastro")
                        setMsgToast("Serviço cadastrado com sucesso!");
                        setClasseToast('Success');
                        setToast(true);
                        limparCampos();
                        setModal(false);
                    }
                }
                else {
                    resp = await api.put('/servicos/editar', {
                        id, nome, maoObra, descricao
                    })
                    setAdd(true);
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar serviço!');
                    }
                    else {
                        limparCampos();
                        setToast(false);
                        setTituloToast("Edição")
                        setMsgToast("Dados atualizados com sucesso!");
                        setClasseToast('Success');
                        setToast(true);
                        setModal(false);
                    }
                }
                carregarServicos();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Alerta', 'Preencha os campos obrigatórios!');
        }
    }

    async function excluirServico() {
        const resp = await api.delete('/servicos/' + id);
        if (JSON.stringify(resp.data.status) == 'false') {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Erro. Não foi possível excluir o serviço");
            setClasseToast('Danger');
            setToast(true);
            setModalExcluir(false);
            setServTemp('');
        }
        else {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Serviço excluído");
            setClasseToast('Success');
            setToast(true);
            setModalExcluir(false);
            setServTemp('');
        }
        carregarServicos();
    }

    async function editarServico(serv_id, i) {
        setId(serv_id);
        carregarCampos(i);
        setAdd(false);
        setModal(true);
    }
    async function visualizarServico(serv_id, i) {
        carregarCampos(i);
        setVisualizar(true);
        setModal(true);
    }
    function limparCampos() {
        setNome('');
        setMaoObra('');
        setDesc('');
        setValue("nome", "");
        setValue("maoObra", "");
        setValue("descricao", "");
        setAdd(true);
    }
    function carregarCampos(i) {
        setNome(servs[i].ser_nome);
        setMaoObra(servs[i].ser_maoObra);
        setDesc(servs[i].ser_descricao);
        setValue("nome", servs[i].ser_nome);
        setValue("maoObra", servs[i].ser_maoObra);
        setValue("descricao", servs[i].ser_descricao);
    }

    return (
        <React.Fragment>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Serviços <BiBriefcaseAlt2 size={25} style={{ margin: '0.3rem' }} /></h2>
                        <BtSair onClick={logout} />
                        <div className="line"></div>

                        {/*botão modal*/}
                        <button type="button" className="btn btn-dark" data-toggle="modal"
                            data-target="#exampleModalScrollable" onClick={() => { clearErrors(); limparCampos(); setModal(true) }}>
                            Adicionar +
                        </button>
                        {/*Campo de busca*/}
                        <AreaSearch placeholder="Busque por um serviço..."
                            value={campoBusca} onKeyUp={carregarServicos} onChange={(e) => setCampoBusca(e.target.value)} onClick={carregarServicos} />

                        <div className="scrollYTable">
                            <table className="table table-hover" style={{ overflow: 'auto' }} >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Mão de Obra (R$)</th>
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servs.map((serv, i) => (
                                        <tr key={i}>
                                            <th scope="row">{serv.ser_id}</th>
                                            <td>{serv.ser_nome}</td>
                                            <td>{(serv.ser_maoObra)}</td>
                                            <td>{(serv.ser_descricao)}</td>{/*length > 20 ? (serv.ser_descricao).substr(0, 20) + "..." : serv.ser_descricao*/}
                                            <td >
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Visualizar" className='m-0 p-0 px-1 border-0 bg-transparent btn-dark' onClick={() => { visualizarServico(serv.ser_id, i); }}>
                                                    <FiEye className='btComum' />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Editar" className='m-0 p-0 px-1 border-0 bg-transparent btn-dark'>
                                                    <FiEdit className='btComum' onClick={() => { clearErrors(); limparCampos(); editarServico(serv.ser_id, i) }} />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Excluir"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-danger'>
                                                    <FiTrash className='btExcluir' onClick={() => { setId(serv.ser_id); setServTemp(serv.ser_nome); setModalExcluir(true); }} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <React.Fragment>
                <Modal className="col-6" show={modal} onHide={() => { setModal(false); setVisualizar(false) }}>
                    <Modal.Header className='modal-title' closeButton >{visualizar ? "Visualizar serviço" : add ? "Cadastro de serviço" : "Editar serviço"}</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={gravarServico}>
                            <Form.Input leitura={visualizar} cols="col-md-12" id="nome" name="nome" placeholder="Ex: Troca de Óleo" label="Nome do Serviço"
                                register={register} value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }}
                                erro={errors.nome} />
                            <Form.InputMoney leitura={visualizar} type="text" min="0" cols="col-md-5" id="maoObra" name="maoObra" placeholder="150.00"
                                label="Mão de Obra (R$)" register={register} value={maoObra}
                                onChange={e => {
                                    setMaoObra(e.target.value); setValue("maoObra", e.target.value);
                                    errors.maoObra && trigger('maoObra');
                                }}
                                erro={errors.maoObra} />
                            <Form.InputArea leitura={visualizar} label="Descrição" id="descricao" name="descricao" {...register("descricao")} value={descricao} onChange={e => { console.log(e.target.value); setDesc(e.target.value); setValue("descricao", e.target.value); }} />

                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        {visualizar ?
                            <>
                                <Button variant="secondary" disabled>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" disabled>
                                    Confirmar
                                </Button>
                            </>
                            :
                            <>
                                <Button variant="secondary" onClick={() => { setModal(false); limparCampos(); }}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarServico(e)) }} >
                                    Confirmar
                                </Button>
                            </>
                        }

                    </Modal.Footer>
                </Modal>
            </React.Fragment>
            <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                item="serviço" valor={servTemp} classesMsg={classes} msg={msgForm}
                onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirServico() }} />
            <ToastMessage show={toast} titulo={tituloToast} onClose={() => setToast(false)}
                classes={classeToast} msg={msgToast} />
        </React.Fragment>
    )
}
export default Servico;