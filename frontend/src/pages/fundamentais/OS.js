import React, { useEffect, useState, useContext, useInsertionEffect } from 'react';
import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Form from '../../components/Form';
import Sidebar from '../../components/Sidebar';
import AreaSearch from '../../components/AreaSearch';
import ModalExcluir from '../../components/ModalExcluir';
import BtAdicionar from '../../components/BtAdicionar';
import Select, { SelectReadOnly } from '../../components/Select';

import { FiTrash, FiEdit, FiCheckCircle, FiDownload, FiFilter } from 'react-icons/fi';
import { BsPlusLg } from 'react-icons/bs';
import { RiListSettingsLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import { MdTimeline } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { DadosContext } from '../../context/DadosContext';
import { UtilsContext } from '../../context/UtilsContext'

import ToastMessage from '../../components/ToastMessage';

import EmitirOS from '../../reports/EmitirOS';
import HistoricoPagamentoOS from '../../reports/HistoricoPagamentoOS';
import EmitirOrcamento from '../../reports/EmitirOrcamento';
import BtSair from '../../components/BtSair';



function OS() {

    const [os, setOs] = useState([]);
    const [modal, setModal] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [modalFechar, setModalFechar] = useState(false);
    const [serOS, setSerOS] = useState([]);
    const [pecOS, setPecOS] = useState([]);
    const [veiculos, setVeiculos] = useState([]);

    const [cliId, setCliId] = useState("");
    const [veId, setVeId] = useState();
    const [km, setKm] = useState();
    const [serId, setSerId] = useState();
    const [serVal, setSerVal] = useState();

    const [pecId, setPecId] = useState();
    const [pecQtde, setPecQtde] = useState(1);
    const [serQtde, setSerQtde] = useState(1);
    const [pecVal, setPecVal] = useState();

    const [cliente, setCliente] = useState();
    const [veiculo, setVeiculo] = useState();
    const [kilometragem, setKilometragem] = useState();
    const [metodoReceb, setMetodoReceb] = useState("");
    const [parcelas, setParcelas] = useState("");
    const [anotacoes, setAnotacoes] = useState("");
    const [o, setO] = useState(null);
    const [valFiado, setValFiado] = useState(0);
    const [valReceb, setValReceb] = useState("");
    const [dtReceb, setDtReceb] = useState(null);

    const [filtro, setFiltro] = useState("T");
    const [add, setAdd] = useState(true);

    const [orcamento, setOrcamento] = useState(false);
    const [flagCliente, setFlagCliente] = useState(false);

    const [nomeCliente, setNomeCliente] = useState("");
    const [foneCliente, setFoneCliente] = useState("");

    const { clis, carregarClis, servicos, carregarServicos, pecas, carregarPecas } = useContext(DadosContext)
    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, logout } = useContext(UtilsContext)

    const [toast, setToast] = useState(false);
    const [classeToast, setClasseToast] = useState();
    const [msgToast, setMsgToast] = useState("");
    const [tituloToast, setTituloToast] = useState("");
    const [gravouCliente, setGravouCliente] = useState(false);
    const [idNovoCliente, setIdNovoCliente] = useState("");

    const [primeiroClique, setPrimeiroClique] = useState(false);
    const [campoBusca, setCampoBusca] = useState("");

    const schema = yup.object({
        cliId: yup.string().required("Selecione um cliente"),
        veId: yup.string().required("Selecione um veículo"),
        km: yup.string().required("Informe a kilometragem"),
        metodoReceb: yup.string().required("Selecione um Método de Recebimento"),
        parcelas: yup.string().required("Informe a quantidade de parcelas (1 para à vista)"),
        nomeCliente: yup.string().required("Informe o nome do cliente").min(3, "Nome deve ter pelo menos 3 caracteres"),
        foneCliente: yup.string().min(8, "Informe um número válido").max(11, "Informe um número válido"),
        valReceb: yup.string().required("Informe o valor")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, reset, formState: { errors, isValid } } = useForm({
        mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema),
    });

    useEffect(() => {
        carregarOS();
        carregarClis();
        carregarServicos();
        carregarPecas();
    }, []);
    useEffect(() => {
        atualizaVal();
    }, [serId, serQtde]);
    useEffect(() => {
        atualizaPecVal();
    }, [pecId, pecQtde]);

    useEffect(() => {
        carregarVeiculos().then(() => {
            if (o != null && primeiroClique) {
                setVeId(o.ve_id)
                setPrimeiroClique(false);
            }
        });

    }, [cliId]);

    useEffect(() => {
        clearErrors();
    }, [modal, modalFechar]);

    useEffect(() => {
        if (!orcamento)
            setFlagCliente(false);
    }, [orcamento])

    useEffect(() => {
        if (o != null)
            setValFiado(o.os_valTot - valReceb);
    }, [valReceb]);

    async function carregarOS() {
        const resp = await api.get('/ordemservico');

        if (filtro == "Cliente" && campoBusca.length > 0)
            setOs(resp.data.filter(o => o.cli_nome.toUpperCase().includes(campoBusca.toUpperCase())))
        else
            setOs(resp.data)
    }

    function adicionarServico() {
        if (serId != "" && serVal != "" && serVal != undefined) {
            const ser = servicos.filter(ser => ser.ser_id == serId)
            if (ser != null) {
                const data = {
                    id: serId,
                    nome: ser[0].ser_nome,
                    valor: serVal,
                    qtde: serQtde,
                }
                setSerOS([data, ...serOS])
                setSerId("");
                setSerVal("");
                setSerQtde(1);
            }
        }
    }

    function adicionarPeca() {
        if (pecId != "" && pecVal != "" && pecVal != undefined) {
            const pec = pecas.filter(pec => pec.pec_id == pecId)
            if (pec != null) {
                const data = {
                    id: pecId,
                    nome: pec[0].pec_nome,
                    qtde: pecQtde,
                    valor: pecVal,
                }
                setPecOS([data, ...pecOS])
                setPecId("");
                setPecVal("");
                setPecQtde(1);
            }
        }

    }

    async function atualizaVal() {
        const ser = servicos.filter(ser => ser.ser_id == serId)
        if (ser.length > 0) {
            setSerVal(ser[0].ser_maoObra * Number(serQtde))
            setValue("valor", ser[0].ser_maoObra)
        }
    }

    async function atualizaPecVal() {
        const pec = pecas.filter(pec => pec.pec_id == pecId)
        if (pec.length > 0) {
            setPecVal(pec[0].pec_preco * Number(pecQtde));
        }
    }

    function formatarData(data) {
        data = data.split('-')
        return data[2] + '/' + data[1] + '/' + data[0]
    }

    async function carregarVeiculos() {
        const resp = await api.get('/veiculos/cliente/' + cliId)
        setVeiculos(resp.data.data)
        setVeId("")
    }
    function limparCampos() {
        setSerOS([]);
        setPecOS([]);
        setCliId("");
        setVeId("");
        setKm("");
        setSerId("");
        setSerVal("");
        setNomeCliente("");
        setValue("nomeCliente", "");
        setFoneCliente("");
        setValue("foneCliente", "")
        setIdNovoCliente("");
        setGravouCliente(false);
    }
    function limparCamposFOS() {
        setCliente();
        setVeiculo();
        setKilometragem();
        setMetodoReceb("");
        setParcelas("");
        setValFiado(0);
        setAnotacoes("");
        setDtReceb(null);
        setValReceb("");
        setValue("valReceb", "");
    }

    function calcTot() {
        let soma = 0
        serOS.forEach(element => {
            soma += Number(element.valor)
        });
        pecOS.forEach(element => {
            soma += Number(element.valor)
        });
        return soma
    }

    async function excluirOS() {
        const resp = await api.delete('/ordemservico/' + o.os_id)

        if (resp.data.status) {
            setTituloToast("Exclusão")
            setMsgToast("Orçamento excluído");
            setClasseToast('Success');
            setToast(true);
            setModalExcluir(false);
            setO(null);
        }
        else {
            setTituloToast("Exclusão")
            setMsgToast("Erro ao tentar excluir orçamento");
            setClasseToast('Danger');
            setToast(true);
            setModalExcluir(false);
            setO(null);
        }
        carregarOS();
    }

    async function gravarOrcamento() {

        if (add) {
            if ((flagCliente && gravouCliente) || (!flagCliente && cliId != undefined && cliId != "")) {
                //com cadastro de cliente
                const resp = await api.post('/ordemservico/orcamento', {
                    dataAbertura: (new Date()).toISOString().split('T')[0],
                    ve_id: (!flagCliente && veId != "" && veId != undefined) ? veId : null,
                    vekm: (!flagCliente && km != "" && km != undefined) ? km : null,
                    valTot: calcTot(),
                    status: "O",
                    observacoes: "",
                    cli_id: flagCliente ? idNovoCliente : cliId
                }).then((resp) => {
                    for (let i = 0; i < serOS.length; i++) {
                        api.post('/servicoos', {
                            os_id: resp.data.lastId,
                            ser_id: serOS[i].id,
                            serOS_val: serOS[i].valor,
                            serOS_qtde: serOS[i].qtde
                        }).then((resp2) => { });
                    }
                    for (let i = 0; i < pecOS.length; i++) {
                        api.post('/pecaos', {
                            os_id: resp.data.lastId,
                            pec_id: pecOS[i].id,
                            pecOS_valTot: pecOS[i].valor,
                            pecOS_qtde: pecOS[i].qtde
                        }).then((resp3) => { });
                    }
                });
                limparCampos();
                carregarOS();
                setModal(false);
                setTituloToast("Cadastro")
                setMsgToast("Orçamento registrado com sucesso");
                setClasseToast('Success');
                setToast(true);
            }
            else {
                setClasses("mensagemForm mensagemFom-Erro");
                alerta('mensagemForm mensagemFom-Erro', 'Erro. Selecione um cliente ou registre um novo');
                console.log(classes)
            }

        }
        else {
            await api.delete('/servicoos/' + o.os_id).then((resp) => {
                api.delete('/pecaos/' + o.os_id).then((resp2) => {
                    for (let i = 0; i < serOS.length; i++) {
                        api.post('/servicoos', {
                            os_id: o.os_id,
                            ser_id: serOS[i].id,
                            serOS_val: serOS[i].valor,
                            serOS_qtde: serOS[i].qtde
                        }).then((resp3) => { });
                    }
                    for (let i = 0; i < pecOS.length; i++) {
                        api.post('/pecaos', {
                            os_id: o.os_id,
                            pec_id: pecOS[i].id,
                            pecOS_valTot: pecOS[i].valor,
                            pecOS_qtde: pecOS[i].qtde
                        }).then((resp4) => { console.log(JSON.stringify(resp4.data)) });
                    }
                    api.put('/ordemservico/editar', {
                        os_id: o.os_id,
                        ve_id: (veId == "" || veId == undefined) ? null : veId,
                        os_vekm: (km == "" || km == undefined) ? null : km,
                        os_valTot: calcTot(),
                        os_status: "O",
                        os_observacoes: "",
                        cli_id: cliId
                    }).then((r) => {
                        if (r.data.status) {
                            limparCampos();
                            carregarOS();
                            setModal(false);
                            console.log("modal " + modal);
                            setTituloToast("Edição")
                            setMsgToast("Orçamento editado com sucesso");
                            setClasseToast('Success');
                            setToast(true);
                        }
                    })
                })
            })

        }
    }

    async function gravarOS(e) {
        e.preventDefault();
        if (orcamento)
            gravarOrcamento();
        else if (cliId != undefined && cliId != "" && veId != undefined && veId != "" && km != undefined && km != "") {
            console.log("km: " + km)
            if (add)
                if (errors.cliId == undefined && errors.veId == undefined && errors.km == undefined) {
                    const resp = await api.post('/ordemservico', {
                        dataAbertura: (new Date()).toISOString().split('T')[0],
                        ve_id: veId,
                        vekm: km,
                        valTot: calcTot(),
                        status: "A",
                        observacoes: ""
                    }).then((resp) => {
                        for (let i = 0; i < serOS.length; i++) {
                            api.post('/servicoos', {
                                os_id: resp.data.lastId,
                                ser_id: serOS[i].id,
                                serOS_val: serOS[i].valor,
                                serOS_qtde: serOS[i].qtde
                            }).then((resp2) => { });
                        }
                        for (let i = 0; i < pecOS.length; i++) {
                            api.post('/pecaos', {
                                os_id: resp.data.lastId,
                                pec_id: pecOS[i].id,
                                pecOS_valTot: pecOS[i].valor,
                                pecOS_qtde: pecOS[i].qtde
                            }).then((resp3) => { });
                        }
                        limparCampos();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Ordem de Serviço Aberta!');
                        carregarOS();
                        setTituloToast("Cadastro")
                        setMsgToast("Ordem de serviço aberta!");
                        setClasseToast('Success');
                        setToast(true);

                    });
                }
                else {
                    alerta('mensagemForm mensagemForm-Alerta', 'Erro. Verifique os campos obrigatórios!');
                }
            else {
                await api.delete('/servicoos/' + o.os_id).then((resp) => {
                    api.delete('/pecaos/' + o.os_id).then((resp2) => {
                        for (let i = 0; i < serOS.length; i++) {
                            api.post('/servicoos', {
                                os_id: o.os_id,
                                ser_id: serOS[i].id,
                                serOS_val: serOS[i].valor,
                                serOS_qtde: serOS[i].qtde
                            }).then((resp3) => { });
                        }
                        for (let i = 0; i < pecOS.length; i++) {
                            api.post('/pecaos', {
                                os_id: o.os_id,
                                pec_id: pecOS[i].id,
                                pecOS_valTot: pecOS[i].valor,
                                pecOS_qtde: pecOS[i].qtde
                            }).then((resp4) => { });
                        }
                        api.put('/ordemservico/editar', {
                            os_id: o.os_id,
                            ve_id: veId,
                            os_vekm: km,
                            os_valTot: calcTot(),
                            os_status: o.os_status == "O" ? "A" : o.os_status,
                            os_observacoes: o.os_observacoes,
                            cli_id: cliId
                        }).then((r) => {
                            if (r.data.status) {
                                limparCampos();
                                carregarOS();
                                setModal(false);
                                setTituloToast("Edição")
                                setMsgToast("Ordem de Serviço Editada!");
                                setClasseToast('Success');
                                setToast(true);
                            }
                        })
                    })
                })

                setAdd(true)
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Erro', 'Preencha os campos obrigatórios!');
        }
    }

    async function excluirServico(id) {
        setSerOS(serOS.filter(ser => ser.id !== id));
    }

    async function excluirPeca(id) {
        setPecOS(pecOS.filter(pec => pec.id !== id));
    }

    async function carregarFechamentoOS(os_id) {
        let ordemservico = os.filter(o => o.os_id == os_id)[0]
        setO(ordemservico)
        setCliente(ordemservico.cli_nome)
        setKilometragem(ordemservico.os_vekm)
        setVeiculo(ordemservico.ve_placa)
    }

    async function fecharOS(e) {
        e.preventDefault();

        if (metodoReceb == "" || (metodoReceb == "CC" && parcelas == "") || (valFiado > 0 && dtReceb == null)) {
            alerta('mensagemForm mensagemForm-Erro', 'Preencha os campos obrigatórios!');
        }
        else
            if (errors.metodoReceb == undefined && (errors.parcelas == undefined || metodoReceb != "CC")) {
                const resp = await api.put('/ordemservico', {
                    os_id: o.os_id,
                    os_dataAbertura: o.os_dataAbertura.split('T')[0],
                    os_dataFechamento: (new Date()).toISOString().split('T')[0],
                    ve_id: o.ve_id,
                    os_vekm: o.os_vekm,
                    os_valTot: o.os_valTot,
                    os_status: "F",
                    os_observacoes: anotacoes,
                    os_metodoReceb: metodoReceb,
                    os_qtdeParcelas: parcelas != "" ? parcelas : 1,
                    os_valFiado: valFiado,
                    os_dataReceb: dtReceb
                })
                if (resp.data.status) {
                    if (valFiado > 0) {
                        const resp2 = await api.post('/contareceber', {
                            os_id: o.os_id,
                            cr_dtVenc: dtReceb,
                            cr_valor: valFiado
                        })
                    }
                    setModalFechar(false)
                    setTituloToast("Ordem de Serviço");
                    setMsgToast("Ordem de Serviço fechada com sucesso!");
                    setClasseToast('Success');
                    setToast(true);
                }
                limparCamposFOS();
                carregarOS();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Erro. Verifique os campos obrigatórios!');
            }
    }

    async function editarOS(os_id, i) {
        let ordemservico = os.filter(o => o.os_id == os_id)[0]
        setFlagCliente(false);
        //um orçamento pode se tornar uma os, mas uma os não pode se tornar um orçamento
        limparCampos();
        setO(ordemservico)
        carregarDadosOS(i)
        setAdd(false)
        setModal(true)
        if (ordemservico.os_status == 'O') {
            setOrcamento(true);
        }
    }
    async function carregarDadosOS(i) {
        setCliId(os[i].cli_id)
        setValue("cliId", os[i].cli_id)
        setValue("veId", os[i].ve_id)
        setKm(os[i].os_vekm)
        setValue("km", os[i].os_vekm)
        setVeId(os[i].ve_id)
        setSerId("");
        setSerVal("");
        setPecId("");
        setPecQtde(0);
        setSerQtde(0);
        setPecVal("");
        setSerOS([]);
        setPecOS([]);

        let data = []
        api.get('/servicoos/' + os[i].os_id).then((resp) => {
            for (var k = 0; k < resp.data.length; k++) {
                data.push({
                    id: resp.data[k].ser_id,
                    nome: resp.data[k].ser_nome,
                    valor: resp.data[k].serOS_val,
                    qtde: resp.data[k].serOS_qtde
                })
            }
            setSerOS(data)
        })
        let dataPeca = []
        await api.get('/pecaos/' + os[i].os_id).then((respPeca) => {
            console.log("retorno : " + JSON.stringify(respPeca.data))
            for (var k = 0; k < respPeca.data.length; k++) {
                dataPeca.push({
                    id: respPeca.data[k].pec_id,
                    nome: respPeca.data[k].pec_nome,
                    qtde: respPeca.data[k].pecOS_qtde,
                    valor: respPeca.data[k].pecOS_valTot,
                })
            }
            console.log("dataPeca:\n" + JSON.stringify(dataPeca))
            setPecOS(dataPeca)
        })
    }
    async function relatorio(os) {
        const serv = await api.get('/servicoos/' + os.os_id);
        const pec = await api.get('/pecaos/' + os.os_id);
        if (os.os_status == "O") {
            EmitirOrcamento(os, serv.data, pec.data);
        }
        else
            EmitirOS(os, serv.data, pec.data);
    }

    async function historicoPagamento(os_id) {
        let ordemservico = os.filter(o => o.os_id == os_id)[0]
        const crs = await api.get('/contareceber/' + os_id);
        HistoricoPagamentoOS(ordemservico, crs.data)
    }

    const cadCliente = async (e) => {
        e.preventDefault();
        if (nomeCliente != undefined && nomeCliente != "" && foneCliente != undefined && foneCliente != "") {
            const resp = await api.post('/clientes/cadastrar', {
                cpf: null, nome: nomeCliente, email: null,
                cep: null, endereco: null,
                tel: foneCliente, num: null,
                cidade: null
            });
            setTituloToast("Cadastro");
            if (resp.data.status) {
                setIdNovoCliente(resp.data.lastId);
                setMsgToast("Cliente cadastrado com sucesso");
                setClasseToast('Success');
                setToast(true);
                setGravouCliente(true);
            }
            else {
                setMsgToast("Erro ao tentar cadastrar cliente");
                setClasseToast('Danger');
                setToast(true);
            }
        }
        carregarClis();
    }
    async function filtrarPCliente() {
        await carregarOS()
    }

    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">

                        <h2 className="h2-titulo-secao">Ordem de Serviço <RiListSettingsLine style={{ color: '#231f20' }} /></h2>
                        <BtSair onClick={logout} />

                        <div className="line"></div>

                        <BtAdicionar onClick={() => { limparCampos(); setAdd(true); setGravouCliente(false); setOrcamento(false); setFlagCliente(false); setModal(true); }} />
                        <AreaSearch placeholder="Digite aqui..." value={campoBusca} onKeyUp={filtrarPCliente} onChange={(e) => setCampoBusca(e.target.value)} onClick={filtrarPCliente}>
                            <div className="row col-md-5">
                                <div className="col-md-1" style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                                    <FiFilter size={20} style={{ color: '#231f20' }} />
                                </div>

                                <div className="col-md-6">
                                    <select id="filtro" className="form-select" value={filtro} onChange={e => { setFiltro(e.target.value) }}>
                                        <option selected value={"T"}>Filtre por</option>
                                        <option value={"A"}>O.S. Aberta</option>
                                        <option value={"F"}>O.S. Fechada</option>
                                        <option value={"O"}>Orçamentos</option>
                                        <option value={"Cliente"}>Cliente</option>
                                    </select>
                                </div>
                            </div>

                        </AreaSearch>

                        <table className="table table-hover" style={{ overflow: 'auto' }} >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Data da Abertura</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Marca Veículo</th>
                                    <th scope="col">Placa</th>
                                    <th scope="col">Km</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {os.map((o, i) => (
                                    (filtro == "T" || filtro == "Cliente" || o.os_status == filtro) &&
                                    <tr key={i}>

                                        <th scope="row">{o.os_id}</th>
                                        <td>{o.os_status == "O" ? "Orçamento" : "Ordem de Serviço"}</td>
                                        <td>{formatarData(o.os_dataAbertura.split('T')[0])}</td>
                                        <td>{o.cli_nome}</td>
                                        <td>{o.mc_nome != null ? o.mc_nome : ""}</td>
                                        <td>{o.ve_placa != null ? o.ve_placa : ""}</td>
                                        <td>{o.os_vekm != null ? o.os_vekm : ""}</td>
                                        <td>
                                            <Button data-toggle="tooltip" data-placement="bottom" title="Emitir pdf"
                                                className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                <FiDownload style={{ color: '#231f20' }} onClick={() => { relatorio(o) }} />
                                            </Button>
                                            {(o.os_status == "A") &&

                                                <Button data-toggle="tooltip" data-placement="bottom" title="Fechar OS"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiCheckCircle style={{ color: '#231f20' }} onClick={() => { setModalFechar(true); carregarFechamentoOS(o.os_id); }} />
                                                </Button>
                                            }
                                            {(o.os_status != "F") &&
                                                <Button className='m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { editarOS(o.os_id, i); setPrimeiroClique(true) }}>
                                                    <FiEdit className='btEditar' />
                                                </Button>
                                            }
                                            {o.os_status == "F" &&
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Histórico de Pagamento"
                                                    onClick={() => { historicoPagamento(o.os_id) }} className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <MdTimeline style={{ color: '#231f20' }} />
                                                </Button>
                                            }

                                            {o.os_status == "O" &&
                                                <Button onClick={() => { setO(o); setModalExcluir(true); }}
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiTrash className='btExcluir' />
                                                </Button>
                                            }

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <>
                <Modal size="lg" className="col-md-12" show={modal} onHide={() => { setModal(false) }}>
                    <Modal.Header className='' closeButton>
                        <span style={{ letterSpacing: '0.05em' }} className='modal-title'>{orcamento ? "Orçamento" : "Ordem de Serviço"}<RiListSettingsLine style={{ color: '#231f20' }} /></span>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='col-md-12 pb-2'>
                            <div style={{ position: 'absolute', right: '2rem' }}>
                                <label className="form-check-label" for="flexSwitchCheckDefault">Orçamento&nbsp;</label>
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={orcamento} onChange={(e) => { setOrcamento(e.target.checked) }} />
                            </div>
                        </div>
                        {
                            (orcamento && add) &&
                            <>
                                <p className="col-md-12"></p>
                                <div className="col-md-12 pb-2">
                                    <div style={{ position: 'absolute', right: '2rem' }}>
                                        <label className="form-check-label" for="flexSwitchCheckDefault">Cadastrar Cliente&nbsp;</label>
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={flagCliente} onChange={(e) => { setFlagCliente(e.target.checked) }} />
                                    </div>
                                </div>
                            </>
                        }
                        <Form>
                            {flagCliente ?
                                <div className="container">
                                    <div className='mb-2' style={{ fontWeight: 500 }}>Cliente</div>
                                    <div className="row secaoItensEstatico g-2" >
                                        <Form.Input type="text" cols="col-md-6" id="nomeCliente" name="nomeCliente" placeholder="Ex: José Silva" label="Nome *" register={register}
                                            value={nomeCliente} onChange={e => { setNomeCliente(e.target.value); setValue("nomeCliente", e.target.value); errors.nomeCliente && trigger('nomeCliente'); }} erro={errors.nomeCliente}
                                            leitura={gravouCliente} />
                                        <Form.Input type="text" cols="col-md-4" id="foneCliente" name="foneCliente" placeholder="181111-1111" label="Celular *" register={register}
                                            value={foneCliente} onChange={e => { setFoneCliente(e.target.value); setValue("foneCliente", e.target.value); errors.foneCliente && trigger('foneCliente'); }} erro={errors.foneCliente}
                                            leitura={gravouCliente} />
                                        <div className="col-md-2" style={{ display: 'flex', alignItems: (errors.nomeCliente == errors.foneCliente) ? 'end' : 'center' }}>
                                            <button type="button" style={{ fontSize: '0.8em', fontWeight: 'bold' }} className={(nomeCliente != "" && errors.nomeCliente == errors.foneCliente && foneCliente != "" && !gravouCliente) ? 'btn btn-dark m-0' : 'btn btn-dark m-0 disabled'} onClick={cadCliente}>
                                                OK
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <>
                                    <Select cols="col-md-12" id="cliId" label="Cliente *" register={register} value={cliId}
                                        onChange={e => { setValue("cliId", e.target.value); setCliId(e.target.value); errors.cliId && trigger('cliId'); }}
                                        erro={errors.cliId}>
                                        {clis.map((cli, i) => (
                                            <option key={i} value={cli.cli_id}>{cli.cli_nome}</option>
                                        ))}
                                    </Select>

                                    <Select cols="col-md-6" id="veId" label="Veículos *" register={register} value={veId}
                                        onChange={e => { setValue("veId", e.target.value); setVeId(e.target.value); console.log("veId: " + veId); errors.veId && trigger('veId'); }}
                                        erro={errors.veId}>
                                        {
                                            veiculos.map((ve, i) => (
                                                <option key={i} value={ve.ve_id}>{ve.ve_placa}</option>
                                            ))}
                                    </Select>
                                    <Form.Input type="number" min="0" cols="col-md-6" id="km" name="km" placeholder="80.000 km" label="Kilometragem *" register={register}
                                        value={km} onChange={e => { setValue("km", e.target.value); setKm(e.target.value); errors.km && trigger('km'); }} erro={errors.km} />
                                </>
                            }
                            <div className="container">
                                <div className='mb-1' style={{ fontWeight: 500 }}>Serviços</div>
                                <div className="row secaoItens g-1">

                                    <Button className='btnMais m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { adicionarServico() }}>
                                        <BsPlusLg size={14} style={{ color: '#000' }} />
                                    </Button>
                                    <Select cols="col-md-6" id="serId" label="Nome" register={register} value={serId}
                                        onChange={e => { setValue("serId", e.target.value); setSerId(e.target.value); errors.serId && trigger('serId'); }}
                                        erro={errors.serId}>
                                        {servicos.map((ser, i) => {
                                            if (serOS.filter(sos => sos.id == ser.ser_id).length == 0)
                                                return (<option key={i} value={ser.ser_id}>{ser.ser_nome}</option>)
                                        })}
                                    </Select>
                                    <Form.Input type="number" min="0" cols="col-md-2" id="serQtde" name="serQtde" placeholder=""
                                        label="Quantidade" register={register} value={serQtde} classes="form-control addArrow"
                                        onChange={e => { setSerQtde(e.target.value); }} />
                                    {/*<Form.Input type="number" min="0" cols="col-md-4" id="valor" name="valor" placeholder="R$150,00"
                                        label="Valor (R$)" register={register} value={serVal}
                                        onChange={e => { setValue("valor", e.target.value); setSerVal(e.target.value); errors.valor && trigger("valor"); }}
                                    erro={errors.valor} />*/}
                                    <Form.InputMoney type="text" min="0" cols="col-md-4" id="valor" name="valor" placeholder="R$150,00"
                                        label="Valor (R$)" register={register} value={serVal}
                                        onChange={e => {
                                            if (e.target.value.includes("R$")) {
                                                var val = e.target.value.split('R$')[1];
                                                val = val.replace(",","")
                                                val = val.replace(".","")
                                                setValue("valor", val);
                                                setSerVal(val);
                                            }
                                            else {
                                                setValue("valor", e.target.value);
                                                setSerVal(e.target.value);
                                            }
                                            errors.valor && trigger("valor");
                                        }}
                                        erro={errors.valor} />

                                    {serOS.map((sos, k) => (
                                        <>
                                            <SelectReadOnly key={k} cols="col-md-6" id={sos.id}>
                                                <option selected key={k} value={sos.id}>{sos.nome}</option>
                                            </SelectReadOnly>
                                            <div className="col-md-2">
                                                <label></label>
                                                <input disabled className="form-control addArrow" value={sos.qtde} />
                                            </div>
                                            <div className="col-md-3">
                                                <label></label>
                                                <input disabled value={"R$" + sos.valor} className="form-control" />
                                            </div>
                                            <div className="col-md-1 btExcluirItem">
                                                <Button onClick={() => excluirServico(sos.id)}
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiTrash style={{ color: 'red' }} />
                                                </Button>
                                            </div>
                                        </>
                                    ))}


                                </div>
                            </div>
                            <div className="container">
                                <div className='mb-1' style={{ fontWeight: 500 }}>Peças</div>
                                <div className="row secaoItens g-1">

                                    <Button className='btnMais m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { adicionarPeca() }}>
                                        <BsPlusLg size={14} style={{ color: '#000' }} />
                                    </Button>
                                    <Select cols="col-md-6" id="pecId" label="Nome" register={register} value={pecId}
                                        onChange={e => { setPecId(e.target.value); }}>
                                        {pecas.map((pec, i) => {
                                            if (pecOS.filter(pos => pos.id == pec.pec_id).length == 0)
                                                return (<option key={i} value={pec.pec_id}>{pec.pec_nome}</option>)
                                        })}
                                    </Select>
                                    <Form.Input type="number" min="0" cols="col-md-2" id="pecQtde" name="pecQtde" placeholder=""
                                        label="Quantidade" register={register} value={pecQtde}
                                        onChange={e => { setPecQtde(e.target.value); }} />
                                    {/*<Form.Input type="number" min="0" cols="col-md-4" id="pecValor" name="pecValor" placeholder=""
                                        label="Valor (R$)" register={register} value={pecVal}
                                    onChange={e => { setPecVal(e.target.value); }} />*/}
                                    <Form.InputMoney type="text" min="0" cols="col-md-4" id="pecValor" name="pecValor" placeholder=""
                                        label="Valor (R$)" register={register} value={pecVal}
                                        onChange={e => {
                                            if (e.target.value.includes("R$")) {
                                                var val = e.target.value.split('R$')[1];
                                                val = val.replace(",","")
                                                val = val.replace(".","")
                                                setPecVal(val);
                                            }
                                            else {
                                                setPecVal(e.target.value)
                                            }
                                        }} />

                                    {pecOS.map((pos, k) => (
                                        <>
                                            <SelectReadOnly key={k} cols="col-md-6" id={pos.id}>
                                                <option selected key={k} value={pos.id}>{pos.nome}</option>
                                            </SelectReadOnly>
                                            <div className="col-md-2">
                                                <label></label>
                                                <input disabled className="form-control" value={pos.qtde} />
                                            </div>
                                            <div className="col-md-3">
                                                <label></label>
                                                <input disabled value={"R$" + pos.valor} className="form-control" />
                                            </div>
                                            <div className="col-md-1 btExcluirItem">
                                                <Button onClick={() => excluirPeca(pos.id)}
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiTrash style={{ color: 'red' }} />
                                                </Button>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <label><b style={{ color: 'red' }}>Total (R$):</b> <b>{calcTot()}</b></label>
                            </div>


                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { limparCampos(); setModal(false); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarOS(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <>
                <Modal className="col-md-12" show={modalFechar} onHide={() => { setModalFechar(false) }}>
                    <Modal.Header className='modal-title' closeButton style={{ letterSpacing: '0.05em' }}>Fechar Ordem de Serviço <FiCheckCircle style={{ color: '#231f20' }} /></Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className='col-md-12'>
                                <label><b>Número da OS:</b> #{o && o.os_id}</label>
                            </div>
                            <div className='col-md-12'>
                                <label><b>Valor Total (R$):</b> {o && o.os_valTot}</label>
                            </div>
                            <div className="container">
                                <div className='mb-2'>Proprietário</div>
                                <div className="row secaoItensEstatico g-2" >
                                    <Form.InputRO disabled type="text" cols="col-md-12" id="cliente" name="cliente"
                                        label="Cliente" value={cliente} />
                                    <Form.InputRO disabled type="text" cols="col-md-7" id="veiculo" name="veiculo"
                                        label="Veículo" value={veiculo} />
                                    <Form.InputRO disabled type="text" cols="col-md-5" id="kilometragem" name="kilometragem"
                                        label="Kilometragem" value={kilometragem} />
                                </div>
                            </div>
                            {/*<Form.Input type="number" cols="col-md-6" id="valReceb" name="valReceb"
                                label="Valor Recebido (R$)" value={valReceb}
                                onChange={(e) => {
                                    setValReceb(e.target.value); setValue("valReceb", e.target.value);
                                    errors.valReceb && trigger('valReceb');
                                }} erro={errors.valReceb} />*/}
                            <Form.InputMoney type="text" cols="col-md-6" id="valReceb" name="valReceb"
                                label="Valor Recebido (R$)" value={valReceb}
                                onChange={(e) => {
                                    if (e.target.value.includes("R$")) {
                                        var val = e.target.value.split("R$")[1];
                                        val = val.replace(",", "")
                                        val = val.replace(".", "")
                                        setValReceb(val);
                                        setValue("valReceb", val);
                                    }
                                    else {
                                        setValReceb(e.target.value);
                                        setValue("valReceb", e.target.value);
                                    }
                                    errors.valReceb && trigger('valReceb');
                                }} erro={errors.valReceb} />
                            <label className='row'></label>
                            <Select cols="col-md-6 mb-2" id="metodoReceb" label="Método de Recebimento" register={register}
                                value={metodoReceb} onChange={e => {
                                    setValue("metodoReceb", e.target.value); setMetodoReceb(e.target.value);
                                    errors.metodoReceb && trigger('metodoReceb');
                                }}
                                erro={errors.metodoReceb}>
                                <option value={"CC"}>Cartão de Crédito</option>
                                <option value={"CD"}>Cartão de Débito</option>
                                <option value={"D"}>Dinheiro</option>
                                <option value={"C"}>Cheque</option>
                                <option value={"P"}>PIX</option>
                            </Select>
                            {metodoReceb == "CC" &&
                                <Form.Input type="number" min="0" cols="col-md-3" id="parcelas" name="parcelas" placeholder=""
                                    label="Parcelas" register={register} value={parcelas}
                                    onChange={e => {
                                        setParcelas(e.target.value); setValue("parcelas", e.target.value);
                                        errors.parcelas && trigger('parcelas')
                                    }} erro={errors.parcelas} />
                            }
                            <div className="container">
                                <div className="row secaoItensEstatico g-2" >
                                    {/*<Form.InputRO type="number" min="0" cols="col-md-6" id="valFiado" name="valFiado"
                                        label="Valor Fiado (R$)" value={valFiado} onChange={e => { setValFiado(e.target.value) }} />*/}
                                    <Form.InputMoney type="text" min="0" cols="col-md-6" id="valFiado" name="valFiado"
                                        label="Valor Fiado (R$)" value={valFiado}
                                        onChange={e => {
                                            if (e.target.value.includes("R$")) {
                                                var val = e.target.value.split("R$")[1];
                                                val = val.replace(",","")
                                                val = val.replace(".","")
                                                setValFiado(val);
                                            }
                                            setValFiado(e.target.value)
                                        }} />
                                    <Form.InputRO type="date" min={(new Date()).toISOString().split('T')[0]} cols="col-md-6" id="dataReceb" name="dataReceb"
                                        label="Data do Recebimento" value={dtReceb} onChange={e => { setDtReceb(e.target.value) }} />

                                </div>
                            </div>
                            <Form.InputArea label="Anotações" id="anotacoes" name="anotacoes" value={anotacoes}
                                onChange={e => { setAnotacoes(e.target.value) }} />
                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { limparCamposFOS(); setModalFechar(false); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(fecharOS(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            {
                o != null &&
                <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                    item="Orçamento" valor={o.os_id} classesMsg={classes} msg={msgForm}
                    onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirOS() }} />
            }
            <ToastMessage show={toast} titulo={tituloToast} onClose={() => setToast(false)}
                classes={classeToast} msg={msgToast} />
        </>
    )
}
export default OS;