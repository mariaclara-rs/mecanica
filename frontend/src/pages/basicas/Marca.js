import React, { useEffect, useState, useContext } from 'react';

import { UtilsContext } from '../../context/UtilsContext'

import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import Form from '../../components/Form'
import Search from '../../components/Search'
import ModalExcluir from '../../components/ModalExcluir';
import AreaSearch from '../../components/AreaSearch';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { BiGlobe } from "react-icons/bi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiTrash, FiEdit, FiEye } from 'react-icons/fi';

import BtSair from '../../components/BtSair';

import ToastMessage from '../../components/ToastMessage';


function Marca() {

    const [nome, setNome] = useState('')
    const [marcas, setMarcas] = useState([])

    const [modal, setModal] = useState(false);
    const [add, setAdd] = useState(true);

    const [id, setId] = useState('');
    const [marcaTemp, setMarcaTemp] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);
    const [campoBusca, setCampoBusca] = useState('');

    const [toast, setToast] = useState(false);
    const [classeToast, setClasseToast] = useState();
    const [msgToast, setMsgToast] = useState("");
    const [tituloToast, setTituloToast] = useState("");

    const [visualizar, setVisualizar] = useState(false);
    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, logout } = useContext(UtilsContext)

    const schema = yup.object({
        nome: yup.string().required("Informe a marca"),
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    useEffect(() => {
        carregarMarcas();

    }, []);

    async function carregarMarcas() {
        const resp = await api.get('/marcas');
        if (campoBusca.length > 0)
            setMarcas(resp.data.filter(m => m.mc_nome.toUpperCase().includes(campoBusca.toUpperCase())))
        else
            setMarcas(resp.data);
    }

    async function gravarMarca(e) {
        e.preventDefault();
        if (nome.length > 0) {
            if (errors.nome == undefined) {
                let resp;
                if (add) {
                    resp = await api.post('/marcas/gravar', {
                        nome
                    });
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar cadastrar marca!');
                    }
                    else {
                        limparCampos();
                        setToast(false);
                        setTituloToast("Cadastro")
                        setMsgToast("Marca cadastrada com sucesso!");
                        setClasseToast('Success');
                        setToast(true);
                        setModal(false);
                    }
                }
                else {
                    resp = await api.put('/marcas/editar', {
                        id, nome
                    })
                    setAdd(true);
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar marca!');
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
                carregarMarcas();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Alerta', 'Preencha a marca!');
        }
    }

    async function excluirMarca() {
        const resp = await api.delete('/marcas/' + id);
        if (JSON.stringify(resp.data.status) == 'false') {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Erro. Não foi possível excluir a marca");
            setClasseToast('Danger');
            setToast(true);
            setModalExcluir(false);
            setMarcaTemp('');
        }
        else {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Marca excluída");
            setClasseToast('Success');
            setToast(true);
            setModalExcluir(false);
            setMarcaTemp('');
        }
        carregarMarcas();
    }

    async function editarMarca(mc_id, i) {
        setId(mc_id);
        carregarCampos(i);
        setAdd(false);
        setModal(true);
    }

    async function visualizarMarca(mc_id, i) {
        setVisualizar(true);
        carregarCampos(i);
        setModal(true);
    }

    function limparCampos() {
        setNome('');
        setValue("nome", "");
        setAdd(true);
    }
    function carregarCampos(i) {
        setNome(marcas[i].mc_nome);
        setValue("nome", marcas[i].mc_nome);
    }

    return (
        <React.Fragment>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Marcas <BiGlobe size={22} style={{ margin: '0.3rem' }} /></h2>
                        <BtSair onClick={logout} />
                        <div className="line"></div>

                        {/*botão modal*/}
                        <button type="button" className="btn btn-dark" data-toggle="modal"
                            data-target="#exampleModalScrollable" onClick={() => { clearErrors(); limparCampos(); setModal(true) }}>
                            Adicionar + <FontAwesomeIcon icon="fa-light fa-building-circle-arrow-right" />
                        </button>
                        {/*Campo de busca*/}
                        <AreaSearch placeholder="Busque por uma distribuidora..."
                            value={campoBusca} onKeyUp={carregarMarcas} onChange={(e) => setCampoBusca(e.target.value)} onClick={carregarMarcas} />
                        <div className="col-md-10 scrollYTable">
                            <table className="table table-hover" style={{ overflow: 'auto' }} >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marcas.map((m, i) => (
                                        <tr key={i}>
                                            <th scope="row">{m.mc_id}</th>
                                            <td>{m.mc_nome}</td>
                                            <td >
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Visualizar"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-dark' onClick={() => { visualizarMarca(m.mc_id, i); }}>
                                                    <FiEye className='btComum' />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Editar"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-dark'>
                                                    <FiEdit className='btComum' onClick={() => { clearErrors(); limparCampos(); editarMarca(m.mc_id, i) }} />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Excluir"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-danger'>
                                                    <FiTrash className='btExcluir' onClick={() => { setId(m.mc_id); setMarcaTemp(m.mc_nome); setModalExcluir(true); }} />
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
                <Modal className="col-6" show={modal} onHide={() => { setModal(false); setVisualizar(false); }}>
                    <Modal.Header className='modal-title' closeButton >{visualizar ? "Visualizar marca" : add ? "Cadastro de marca" : "Editar marca"}</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={gravarMarca}>
                            <Form.Input leitura={visualizar} cols="col-md-12" id="nome" name="nome" placeholder="Ex: Mercedes-Benz" label="Marca"
                                register={register} value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }}
                                erro={errors.nome} />

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
                                <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarMarca(e)) }} >
                                    Confirmar
                                </Button>
                            </>
                        }
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
            <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                item="marca" valor={marcaTemp} classesMsg={classes} msg={msgForm}
                onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirMarca() }} />
            <ToastMessage show={toast} titulo={tituloToast} onClose={() => setToast(false)}
                classes={classeToast} msg={msgToast} />
        </React.Fragment>
    )
}
export default Marca;