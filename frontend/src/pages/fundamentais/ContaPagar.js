import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import AreaSearch from '../../components/AreaSearch';
import BtAdicionar from '../../components/BtAdicionar';
import Form from '../../components/Form';
import Select, { SelectReadOnly } from '../../components/Select';

import { FiTrash, FiEdit, FiCheckCircle } from 'react-icons/fi';
import { RiWallet3Line } from 'react-icons/ri';
import { BsPlusLg } from 'react-icons/bs';

import { DadosContext } from '../../context/DadosContext';
import { UtilsContext } from '../../context/UtilsContext'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

function ContaPagar() {

    const [modal, setModal] = useState(false)
    const [modalQuitar, setModalQuitar] = useState(false)
    const [add, setAdd] = useState(true)
    const [cp, setCP] = useState([]);

    const [vetParc, setVetParc] = useState([]);
    const [vetPec, setVetPec] = useState([]);

    const [tdId, setTdId] = useState();
    const [distId, setDistId] = useState();
    const [dtVenc, setDtVenc] = useState();
    const [parcVal, setParcVal] = useState();
    const [pecId, setPecId] = useState();
    const [pecQtde, setPecQtde] = useState(1);
    const [pecVal, setPecVal] = useState();
    const [numParc, setNumParc] = useState();

    const [tipoDespesa, setTipoDespesa] = useState();
    const [dist, setDist] = useState();
    const [parcId, setParcId] = useState();
    const [valTot, setValTot] = useState();
    const [valCP, setValCP] = useState();
    const [valParc, setValParc] = useState();
    const [metodoPag, setMetodoPag] = useState();
    const [dtPag, setDtPag] = useState();
    const [anotacoes, setAnotacoes] = useState();
    const [parcAtual, setParcAtual] = useState();
    const [cpAtual, setCpAtual] = useState();

    const { clis, carregarClis, servicos, carregarServicos, pecas, carregarPecas, tpDespesa, carregarTpDespesa,
        dists, carregarDists } = useContext(DadosContext)
    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, formatarDataParaUsuario } = useContext(UtilsContext)


    const schema = yup.object({
        tdId: yup.string().required("Selecione o tipo de despesa"),
        distId: yup.string().required("Selecione a distribuidora"),
        dtVenc: yup.string().required("Informe a data de vencimento"),
        parcVal: yup.string().required("Informe o valor da parcela"),
        pecId: yup.string().required("Selecione uma peça"),
        pecQtde: yup.string().required("Informe a quantidade"),
        pecVal: yup.string().required("Informe o valor"),
        numParc: yup.string().required("Informe o número"),
        parcId: yup.string().required("Selecione uma parcela"),
        metodoPag: yup.string().required("Selecione um método"),
        dtPag: yup.string().required("Selecione a data")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, reset, formState: { errors, isValid } } = useForm({
        mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema),
    });

    useEffect(() => {
        carregarTpDespesa();
        carregarDists();
        carregarPecas();
        carregarCP();
    }, [])
    useEffect(() => {
        carregarCP();
    }, [modalQuitar]);
    useEffect(() => {
        let parc = vetParc.filter(par => par.num == numParc)
        if (parc.length > 0) {
            setNumParc(Number(numParc) + 1)
        }
    }, [numParc])

    useEffect(() => {
        atualizaPecVal();
    }, [pecId, pecQtde]);

    function adicionarPeca() {
        if (pecId != "" && pecQtde != undefined && pecQtde > 0 && pecVal != "" && pecVal != undefined) {
            let pec = pecas.filter(pec => pec.pec_id == pecId)
            if (pec != null) {
                const data = {
                    id: pecId,
                    nome: pec[0].pec_nome,
                    qtde: pecQtde,
                    valor: pecVal,
                }
                setVetPec([data, ...vetPec])
                setPecId("");
                setPecVal("");
                setPecQtde("");
            }
        }
    }
    function adicionarParcela() {
        if (numParc != "" && numParc != undefined && parcVal != "" && parcVal != undefined && dtVenc != "" && dtVenc != undefined) {
            //let parc = vetParc.filter(par => par.num == )
            //if (pec != null) {
            const data = {
                num: numParc,
                valor: parcVal,
                dtVenc: dtVenc
            }
            setVetParc([data, ...vetParc])
            setParcVal("");
            setDtVenc("");
            //}
        }
    }
    async function excluirPeca(id) {
        setVetPec(vetPec.filter(pec => pec.id !== id));
    }
    async function excluirParc(num) {
        setVetParc(vetParc.filter(par => par.num !== num));
    }

    async function carregarCP() {
        console.log("carregar CP")
        const resp = await api.get('/contapagar');
        setCP(resp.data);
    }

    function calcTot() {
        let soma = 0
        vetParc.forEach(element => {
            soma += Number(element.valor)
        });
        return soma
    }
    async function atualizaPecVal() {
        const pec = pecas.filter(pec => pec.pec_id == pecId)
        if (pec.length > 0) {
            setPecVal(pec[0].pec_preco * Number(pecQtde));
        }
    }
    async function gravarCP(e) {
        e.preventDefault();
        if (tdId != undefined && tdId != "" && distId != undefined && distId != "") {
            if (errors.tdId == undefined && errors.distId == undefined) {
                if (add) {
                    await api.post('/contapagar', {
                        valTot: calcTot(),
                        dtCriacao: (new Date()).toISOString().split('T')[0],
                        anotacoes: "",
                        distId: distId,
                        tdId: tdId
                    }).then((resp) => {

                        for (let i = 0; i < vetParc.length; i++) {
                            api.post('/parcela', {
                                num: vetParc[i].num,
                                cpId: resp.data.lastId,
                                val: vetParc[i].valor,
                                dtPgto: null,
                                dtVenc: vetParc[i].dtVenc
                            }).then((resp2) => { console.log(JSON.stringify(resp2.data)) });
                        }
                        for (let i = 0; i < vetPec.length; i++) {
                            api.post('/pecacp', {
                                cpId: resp.data.lastId,
                                pecId: vetPec[i].id,
                                qtde: vetPec[i].qtde,
                                valor: vetPec[i].valor
                            }).then((resp3) => { console.log(JSON.stringify(resp3.data)) });
                        }
                    })
                    alerta('mensagemForm mensagemForm-Sucesso', 'Conta a Pagar registrada!');
                }
                else{
                    //excluir pecas de pecascontapagar da c
                    await api.delete('/pecacp/'+cpAtual.cp_id).then((resp)=>{
                        api.delete('/parcela/'+cpAtual.cp_id).then((resp2)=>{
                            for (let i = 0; i<vetPec.length; i++) {
                                api.post('/pecacp', {
                                    cpId: cpAtual.cp_id,
                                    pecId:vetPec[i].id,
                                    qtde:vetPec[i].qtde,
                                    valor:vetPec[i].valor
                                }).then((resp3) => {});
                            }
                            for (let i = 0; i<vetParc.length; i++) {
                                api.post('/parcela', {
                                    num:vetParc[i].num,
                                    cpId:cpAtual.cp_id,
                                    val:vetParc[i].valor,
                                    dtPgto:null,
                                    dtVenc:vetParc[i].dtVenc
                                }).then((resp4) => {});
                            }
                            console.log("distId: "+distId+" tpId: "+tdId);
                            api.put('/contapagar', {
                                cp_id:cpAtual.cp_id,
                                cp_valTot:calcTot(),
                                dist_id:distId,
                                tp_id:tdId
                            }).then((r) => {
                                if (r.data.status) {
                                    alerta('mensagemForm mensagemForm-Sucesso', 'Conta Editada!');
                                    limparCampos();
                                }
                            })
                        })
                    })
                    setAdd(true);
                }
                limparCampos();
                carregarCP();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Erro. Verifique os campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Erro', 'Preencha os campos obrigatórios!');
        }
        carregarCP();
    }
    function limparCampos() {
        clearErrors();
        setCP([]);
        setTdId("");
        setValue("tdId", "")
        setDistId("");
        setValue("distId", "");
        setNumParc("");
        setValue("numParc", "");
        setDtVenc("");
        setValue("dtVenc", "")
        setParcVal("");
        setValue("parcVal", "");
        setVetParc([]);
        setPecId("");
        setValue("pecId", "");
        setPecQtde("");
        setValue("pecQtde", "")
        setPecVal("");
        setValue("pecVal", "");
        setVetPec([]);
        carregarCP();
    }

    function utlimaEmAberto(parcelas) {
        console.log("ultima em aberto")
        let dt = "";
        let situacao = "";
        parcelas.forEach((parcela) => {
            if (parcela.parc_dtPgto == null && (dt == "" || parcela.parc_dtVenc < dt))
                dt = parcela.parc_dtVenc
        })
        if (dt == "")
            return [dt, "Quitada"];
        const data = (new Date());
        let hoje = data.getFullYear() + "-" + (data.getMonth() + 1) + "-";
        if (data.getDate() < 10)
            hoje += '0';
        hoje += data.getDate();
        dt = dt.split('T')[0];
        if (dt == hoje)
            return [formatarDataParaUsuario(dt), <span style={{ color: 'orange' }}>Vence hoje!</span>];
        if (dt < hoje)
            return [formatarDataParaUsuario(dt), <span style={{ color: 'red' }}>Em atraso</span>];
        return [formatarDataParaUsuario(dt), "Regular"];
    }

    function quitarCP(cp) {
        setValParc("");
        setParcId("");
        setValue("parcId", "");
        setMetodoPag("");
        setValue("metodoPag", "");
        setDtPag("");
        setValue("dtPag", "");
        setAnotacoes("");
        setTipoDespesa(cp.tp_nome);
        setDist(cp.dist_nome);
        setVetParc(cp.parcelas);
        setValCP(cp.cp_valTot);
        setCpAtual(cp);

    }

    function verificarParc(parc_num) {
        const parc = vetParc.filter(vp => vp.parc_num == parc_num)[0];
        setValParc(parc.parc_val);
        setMetodoPag("");
        if (parc.parc_metodoPgto != null)
            setMetodoPag(parc.parc_metodoPgto);
        setDtPag("");
        if (parc.parc_dtPgto != null)
            setDtPag(parc.parc_dtPgto.split('T')[0]);
        setAnotacoes("");
        if (parc.parc_anotacoes != null)
            setAnotacoes(parc.parc_anotacoes);
        setParcAtual(parc);
    }

    function campoObrValido(campo) {
        return campo != "" && campo != undefined && campo != null;
    }
    async function quitarParcela(e) {
        e.preventDefault();
        if (campoObrValido(parcId) && campoObrValido(metodoPag) && campoObrValido(dtPag)) {
            if (errors.parcId == undefined && errors.metodoPag == undefined && errors.dtPag == undefined) {
                const resp = await api.put('/parcela', {
                    parc_num: parcAtual.parc_num,
                    cp_id: cpAtual.cp_id,
                    parc_val: parcAtual.parc_val,
                    parc_dtPgto: dtPag.split('T')[0],
                    parc_dtVenc: parcAtual.parc_dtVenc.split('T')[0],
                    parc_metodoPgto: metodoPag,
                    parc_anotacoes: anotacoes
                })

                if (resp.status) {
                    const data = {
                        parc_num: parcAtual.parc_num,
                        parc_val: parcAtual.parc_val,
                        parc_dtPgto: dtPag + "T03:00:00.000Z",
                        parc_dtVenc: parcAtual.parc_dtVenc,
                        parc_metodoPgto: metodoPag,
                        parc_anotacoes: anotacoes
                    }
                    vetParc.forEach((p) => {
                        if (p.parc_num == parcAtual.parc_num) {
                            p.parc_dtPgto = dtPag + "T03:00:00.000Z";
                            p.parc_metodoPgto = metodoPag;
                            p.parc_anotacoes = anotacoes;
                        }
                    })

                    setParcAtual(data);
                    alerta('mensagemForm mensagemForm-Sucesso', 'Parcela paga com sucesso');
                }
                else
                    alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar pagar parcela. Tente mais tarde!');

            }
            else
                alerta('mensagemForm mensagemForm-Alerta', 'Erro. Verifique os campos obrigatórios!');
        }
        else
            alerta('mensagemForm mensagemForm-Erro', 'Preencha os campos obrigatórios!');
    }
    function editarCP(conta, i) {
        limparCampos();
        clearErrors();
        setAdd(false);
        setCpAtual(conta);
        setTdId(conta.tp_id);
        setValue("tdId", conta.tp_id);
        setDistId(conta.dist_id);
        setValue("distId", conta.dist_id);
        setVetPec([]);
        let data = [];
        conta.pecas.forEach((p) => {
            data.push({
                id: p.pec_id,
                nome: p.pec_nome,
                qtde: p.pcp_qtde,
                valor: p.pcp_valor
            })
        })
        setVetPec(data);
        setVetParc([]);
        data = [];
        for (let i = 0; i < conta.parcelas.length; i++) {
            data.push({
                num: conta.parcelas[i].parc_num,
                valor: conta.parcelas[i].parc_val,
                dtVenc: conta.parcelas[i].parc_dtVenc.split('T')[0]
            })
        }
        setVetParc(data);
        setModal(true);
    }
    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Contas a Pagar  <RiWallet3Line style={{ color: '#231f20' }} /></h2>
                        <div className="line"></div>
                        <BtAdicionar onClick={() => { clearErrors(); setAdd(true); setModal(true); limparCampos(); }} />
                        <AreaSearch placeholder="Digite aqui..." />

                        <table className="table table-hover" style={{ overflow: 'auto' }} >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tipo de Despesa</th>
                                    <th scope="col">Última em aberto</th>
                                    <th scope="col">Situação</th>
                                    <th scope="col">Quantidade de Parcelas</th>
                                    <th scope="col">Valor Total</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cp.map((c, i) => (
                                    <tr key={i}>
                                        <th scope="row">{c.cp_id}</th>
                                        <td>{c.tp_nome}</td>
                                        <td>{utlimaEmAberto(c.parcelas)[0]}</td>
                                        <td>{utlimaEmAberto(c.parcelas)[1]}</td>
                                        <td>{c.parcelas.length}</td>
                                        <td>{c.cp_valTot}</td>
                                        <td >
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent ' onClick={() => { limparCampos(); quitarCP(c); setModalQuitar(true) }}>
                                                <FiCheckCircle style={{ color: '#231f20' }} />
                                            </Button>
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent ' onClick={() => { editarCP(c, i) }}>
                                                <FiEdit className='btEditar' />
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
                    <Modal.Header className='modal-title' closeButton style={{ letterSpacing: '0.03em' }}>
                        Quitar Pagamento&nbsp; <FiCheckCircle style={{ color: '#231f20' }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="container">
                                <div className='mb-2' style={{ fontWeight: 500 }}>Dados da Conta</div>
                                <div className="row secaoItensEstatico g-2" >
                                    <Form.Input disabled type="text" cols="col-md-5" id="tipoDespesa" name="tipoDespesa"
                                        label="Tipo de Despesa" value={tipoDespesa} />
                                    <Form.Input disabled type="text" cols="col-md-7" id="distribuidora" name="distribuidora"
                                        label="Distribuidora" value={dist} />
                                    <Select cols="col-md-5" id="parcId" label="Parcelas" register={register} value={parcId}
                                        onChange={e => { verificarParc(e.target.value); setParcId(e.target.value); setValue("parcId", e.target.value); errors.parcId && trigger('parcId') }}
                                        erro={errors.parcId}>
                                        {vetParc.map((parc, i) => {
                                            if (parc.num == undefined)
                                                if (parc.parc_dtPgto == null)
                                                    return (
                                                        <option key={i} value={parc.parc_num}>{formatarDataParaUsuario(parc.parc_dtVenc.split('T')[0])}</option>
                                                    )
                                                else
                                                    return (
                                                        <option style={{ color: 'gray' }} key={i} value={parc.parc_num}>{formatarDataParaUsuario(parc.parc_dtVenc.split('T')[0])}</option>
                                                    )
                                            else {
                                                return (
                                                    <option key={i} value={parc.num}>{formatarDataParaUsuario(parc.dtVenc.split('T')[0])}</option>
                                                )
                                            }
                                        })}
                                    </Select>
                                    <Form.Input disabled type="text" cols="col-md-5" id="valTot" name="valTot"
                                        label="Valor Total (R$)" value={valCP} />
                                </div>
                            </div>
                            <Form.Input disabled type="text" cols="col-md-6" id="valParcSelect" name="valParcSelect"
                                label="Valor Parcela" value={valParc} />
                            <label className='col-md-6'></label>
                            {(parcAtual != null && parcAtual.parc_dtPgto != null) ?
                                <>
                                    <SelectReadOnly cols="col-md-6" id="metodoPag" name="metodoPag" label="Método de Pagamento"
                                        value={metodoPag} >
                                        <option value={"CC"}>Cartão de Crédito</option>
                                        <option value={"CD"}>Cartão de Débito</option>
                                        <option value={"D"}>Dinheiro</option>
                                        <option value={"C"}>Cheque</option>
                                        <option value={"P"}>PIX</option>
                                    </SelectReadOnly>
                                    <Form.Input disabled type="date" cols="col-md-6"
                                        id="dtPag" name="dtPag" label="Data de Pagamento" register={null} value={dtPag} />
                                    <Form.InputArea disabled label="Anotações" id="anotacoes" name="anotacoes" value={anotacoes} />
                                </>
                                :
                                <>
                                    <Select cols="col-md-6" id="metodoPag" label="Método de Pagamento" register={register}
                                        value={metodoPag} onChange={e => { setMetodoPag(e.target.value); setValue("metodoPag", e.target.value); errors.metodoPag && trigger('metodoPag') }}
                                        erro={errors.metodoPag}>
                                        <option value={"CC"}>Cartão de Crédito</option>
                                        <option value={"CD"}>Cartão de Débito</option>
                                        <option value={"D"}>Dinheiro</option>
                                        <option value={"C"}>Cheque</option>
                                        <option value={"P"}>PIX</option>
                                    </Select>
                                    <Form.Input type="date" cols="col-md-6"
                                        id="dtPag" name="dtPag" label="Data de Pagamento" register={register} value={dtPag}
                                        onChange={e => { setDtPag(e.target.value); setValue("dtPag", e.target.value); errors.dtPag && trigger('dtPag') }}
                                        erro={errors.dtPag} />
                                    <Form.InputArea label="Anotações" id="anotacoes" name="anotacoes" value={anotacoes}
                                        onChange={e => { setAnotacoes(e.target.value) }} />
                                </>
                            }


                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setModalQuitar(false); }}>
                            Cancelar
                        </Button>
                        {(parcAtual != null && parcAtual.parc_dtPgto != null) ?
                            <Button disabled type="submit" variant="primary" >
                                Confirmar
                            </Button>
                            :
                            <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(quitarParcela(e)) }} >
                                Confirmar
                            </Button>
                        }
                    </Modal.Footer>
                </Modal>
            </>
            <>
                <Modal className="col-md-12" show={modal} onHide={() => { setModal(false) }}>
                    <Modal.Header className='modal-title' closeButton style={{ letterSpacing: '0.03em' }}>
                        {add ? "Registrar Conta a Pagar" : "Editar Conta a Pagar"}&nbsp;<RiWallet3Line style={{ color: '#231f20' }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Select cols="col-md-6" id="tdId" label="Tipo de Despesa" register={register} value={tdId}
                                onChange={e => { setValue("tdId", e.target.value); setTdId(e.target.value); errors.tdId && trigger('tdId'); }}
                                erro={errors.tdId}>
                                {tpDespesa.map((tpDesp, i) => (
                                    <option key={i} value={tpDesp.tp_id}>{tpDesp.tp_nome}</option>
                                ))}
                            </Select>
                            <Select cols="col-md-6" id="distId" label="Distribuidora" register={register} value={distId}
                                onChange={e => { setValue("distId", e.target.value); setDistId(e.target.value); errors.distId && trigger('distId'); }}
                                erro={errors.distId}>
                                {dists.map((dist, i) => (
                                    <option key={i} value={dist.dist_id}>{dist.dist_nome}</option>
                                ))}
                            </Select>
                            <div className="container">
                                <div id="title">Parcelas</div>
                                <div className="row secaoItens">
                                    <Button className='btnMais m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { }}>
                                        <BsPlusLg size={14} style={{ color: '#000' }} onClick={() => { adicionarParcela() }} />
                                    </Button>
                                    <Form.Input type="number" min="1" cols="col-md-2" id="numParc" name="numParc" placeholder=""
                                        label="Num" register={register} value={numParc}
                                        onChange={e => {
                                            setValue("numParc", e.target.value); setNumParc(e.target.value); errors.numParc && trigger('numParc');
                                        }} erro={errors.numParc} />

                                    <Form.Input type="date" min={(new Date()).toISOString().split('T')[0]} cols="col-md-6"
                                        id="dtVenc" name="dtVenc" label="Data de Vencimento" register={register} value={dtVenc}
                                        onChange={e => { setValue("dtVenc", e.target.value); setDtVenc(e.target.value); errors.dtVenc && trigger('dtVenc'); }}
                                        erro={errors.dtVenc} />
                                    <Form.Input type="number" min="0" cols="col-md-4" id="parcVal" name="parcVal" placeholder=""
                                        label="Valor" register={register} value={parcVal}
                                        onChange={e => {
                                            setValue("parcVal", e.target.value); setParcVal(e.target.value); errors.parcVal && trigger('parcVal');
                                        }} erro={errors.parcVal} />

                                    {vetParc.map((parc, k) => (
                                        <>
                                            <div className="col-md-2">
                                                <label></label>
                                                <input disabled value={parc.num} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label></label>
                                                <input disabled type="date" value={parc.dtVenc} className="form-control" />
                                            </div>
                                            <div className="col-md-3">
                                                <label></label>
                                                <input disabled type="number" value={parc.valor} className="form-control" />
                                            </div>
                                            <div className="col-md-1 btExcluirItem">
                                                <Button onClick={() => { excluirParc(parc.num) }}
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiTrash style={{ color: 'red' }} />
                                                </Button>
                                            </div>

                                        </>
                                    ))}
                                </div>
                            </div>
                            <div className="container">
                                <div id="title">Peças</div>
                                <div className="row secaoItens">
                                    <Button className='btnMais m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { adicionarPeca() }}>
                                        <BsPlusLg size={14} style={{ color: '#000' }} />
                                    </Button>
                                    <Select cols="col-md-6" id="pecId" label="Nome" register={register} value={pecId}
                                        onChange={e => { setValue("pecId", e.target.value); setPecId(e.target.value); errors.pecId && trigger('pecId'); }}
                                        erro={errors.pecId}>
                                        {pecas.map((pec, i) => {
                                            if (vetPec.filter(vpec => vpec.id == pec.pec_id).length == 0)
                                                return (<option key={i} value={pec.pec_id}>{pec.pec_nome}</option>)
                                        })}
                                    </Select>
                                    <Form.Input type="number" min="0" cols="col-md-2" id="pecQtde" name="pecQtde" placeholder=""
                                        label="Qtde." register={register} value={pecQtde}
                                        onChange={e => { setValue("pecQtde", e.target.value); setPecQtde(e.target.value); errors.pecQtde && trigger('pecQtde'); }}
                                        erro={errors.pecQtde} />
                                    <Form.Input type="number" min="0" cols="col-md-4" id="pecVal" name="pecVal" placeholder=""
                                        label="Valor (R$)" register={register} value={pecVal}
                                        onChange={e => { setValue("pecVal", e.target.value); setPecVal(e.target.value); errors.pecVal && trigger('pecVal'); }}
                                        erro={errors.pecVal} />

                                    {vetPec.map((pec, k) => (
                                        <>
                                            <SelectReadOnly key={k} cols="col-md-6" id={pec.id}>
                                                <option selected key={k} value={pec.id}>{pec.nome}</option>
                                            </SelectReadOnly>
                                            <div className="col-md-2">
                                                <label></label>
                                                <input disabled className="form-control" value={pec.qtde} />
                                            </div>
                                            <div className="col-md-3">
                                                <label></label>
                                                <input disabled value={pec.valor} className="form-control" />
                                            </div>
                                            <div className="col-md-1 btExcluirItem">
                                                <Button onClick={() => excluirPeca(pec.id)}
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
                        <Button variant="secondary" onClick={() => { setModal(false); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarCP(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        </>
    )
}
export default ContaPagar;