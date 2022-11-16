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

import { FiTrash, FiEdit, FiEye } from 'react-icons/fi';
import { GrTroubleshoot } from "react-icons/gr"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import BtSair from '../../components/BtSair';
import CurrencyInput from '../../components/CurrencyInput';

import ToastMessage from '../../components/ToastMessage';
function Peca() {

    const [nome, setNome] = useState('')
    const [preco, setPreco] = useState('')

    const [pecas, setPecas] = useState([])

    const [modal, setModal] = useState(false);
    const [add, setAdd] = useState(true);

    const [id, setId] = useState('');
    const [pecaTemp, setPecaTemp] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);
    const [campoBusca, setCampoBusca] = useState('');

    const [toast, setToast] = useState(false);
    const [classeToast, setClasseToast] = useState();
    const [msgToast, setMsgToast] = useState("");
    const [tituloToast, setTituloToast] = useState("");

    const [visualizar, setVisualizar] = useState(false);

    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, logout } = useContext(UtilsContext)

    const schema = yup.object({
        nome: yup.string().required("Informe o nome da peça"),
        preco: yup.string("Informe o preço").required("Informe o preço")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    useEffect(() => {
        carregarPecas();

    }, []);

    async function carregarPecas() {
        const resp = await api.get('/pecas');
        if (campoBusca.length > 0)
            setPecas(resp.data.filter(p => p.pec_nome.toUpperCase().includes(campoBusca.toUpperCase())))
        else
            setPecas(resp.data);
    }

    async function gravarPeca(e) {
        e.preventDefault();
        if (nome.length > 0) {
            if (errors.nome == undefined) {
                let resp;
                if (add) {
                    console.log("nome: " + nome + " preço: " + preco)
                    resp = await api.post('/pecas/gravar', {
                        nome, preco: preco == '' ? 0 : preco
                    });
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar cadastrar peça!');
                    }
                    else {
                        limparCampos();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Peça cadastrado!');
                        setToast(false);
                        setTituloToast("Cadastro")
                        setMsgToast("Peça cadastrada com sucesso!");
                        setClasseToast('Success');
                        setToast(true);
                        setModal(false);
                    }
                }
                else {
                    resp = await api.put('/pecas/editar', {
                        id, nome, preco: preco == '' ? 0 : preco
                    })
                    setAdd(true);
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar peça!');
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
                carregarPecas();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Alerta', 'Preencha os campos!');
        }
    }

    async function excluirPeca() {
        const resp = await api.delete('/pecas/' + id);
        if (JSON.stringify(resp.data.status) == 'false') {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Erro. Não foi possível excluir a peça");
            setClasseToast('Danger');
            setToast(true);
            setModalExcluir(false);
            setPecaTemp('');
        }
        else {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Peça excluída");
            setClasseToast('Success');
            setToast(true);
            setModalExcluir(false);
            setPecaTemp('');

        }
        carregarPecas();
    }

    async function editarPeca(pec_id, i) {
        setId(pec_id);
        carregarCampos(i);
        setAdd(false);
        setModal(true);
    }

    async function visualizarPeca(pec_id, i) {
        setVisualizar(true);
        carregarCampos(i);
        setModal(true);
    }

    function limparCampos() {
        setNome('');
        setPreco('');
        setValue("nome", "");
        setValue("preco", "");
        setAdd(true);
    }
    function carregarCampos(i) {
        setNome(pecas[i].pec_nome);
        setPreco((pecas[i].pec_preco));
        setValue("nome", pecas[i].pec_nome);
        setValue("preco", pecas[i].pec_preco);
    }

    return (
        <React.Fragment>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Peças <GrTroubleshoot size={22} style={{ margin: '0.3rem' }} /></h2>
                        <BtSair onClick={logout} />
                        <div className="line"></div>

                        {/*botão modal*/}
                        <button type="button" className="btn btn-dark" data-toggle="modal"
                            data-target="#exampleModalScrollable" onClick={() => { clearErrors(); limparCampos(); setModal(true) }}>
                            Adicionar + <FontAwesomeIcon icon="fa-light fa-building-circle-arrow-right" />
                        </button>
                        {/*Campo de busca*/}
                        <AreaSearch placeholder="Busque por peças..."
                            value={campoBusca} onKeyUp={carregarPecas} onChange={(e) => setCampoBusca(e.target.value)} onClick={carregarPecas} />

                        <div className="col-md-12 scrollYTable">
                            <table className="table table-hover" style={{ overflow: 'auto' }} >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Preço</th>
                                        <th scope="col">Ação</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {pecas.map((p, i) => (
                                        <tr key={i}>
                                            <th scope="row">{p.pec_id}</th>
                                            <td>{p.pec_nome}</td>
                                            <td>{Math.round(p.pec_preco * 100) / 100}</td>
                                            <td >
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Visualizar" className='m-0 p-0 px-1 border-0 bg-transparent btn-dark' onClick={() => { visualizarPeca(p.pec_id, i) }}>
                                                    <FiEye className='btComum' />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Editar" className='m-0 p-0 px-1 border-0 bg-transparent btn-dark'>
                                                    <FiEdit className='btComum' onClick={() => { clearErrors(); limparCampos(); editarPeca(p.pec_id, i) }} />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Excluir"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-danger'>
                                                    <FiTrash className='btExcluir' onClick={() => { setId(p.pec_id); setPecaTemp(p.pec_nome); setModalExcluir(true); }} />
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
                    <Modal.Header className='modal-title' closeButton >{visualizar ? "Visualizar peça" : add ? "Cadastro de peça" : "Editar Ppeça"}</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={gravarPeca}>
                            <Form.Input leitura={visualizar} cols="col-md-12" id="nome" name="nome" placeholder="Ex: Chave de roda" label="Nome da Peça *"
                                register={register} value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }}
                                erro={errors.nome} />

                            <Form.InputMoney leitura={visualizar} type="text" cols="col-md-5" id="preco" name="preco" placeholder="R$ 50.00" label="Preço (R$)"
                                register={register} value={preco} onChange={e => {
                                    setPreco(e.target.value); setValue("preco", e.target.value);
                                    errors.preco && trigger('preco');
                                }} erro={errors.preco} />

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
                                <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarPeca(e)) }} >
                                    Confirmar
                                </Button>
                            </>
                        }
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
            <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                item="peça" valor={pecaTemp} classesMsg={classes} msg={msgForm}
                onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirPeca() }} />

            <ToastMessage show={toast} titulo={tituloToast} onClose={() => setToast(false)}
                classes={classeToast} msg={msgToast} />
        </React.Fragment>
    )
}
export default Peca;