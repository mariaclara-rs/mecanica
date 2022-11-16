import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import apiCEP from '../../services/cep';

import Form from '../../components/Form';
import Sidebar from '../../components/Sidebar';
import { Modal, Button } from 'react-bootstrap';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { DadosContext } from '../../context/DadosContext';
import { UtilsContext } from '../../context/UtilsContext';

import BtSair from '../../components/BtSair';

function Perfil() {
    const schema = yup.object({
        nome: yup.string().required("Informe o nome fantasia"),
        cnpj: yup.string().length(18, "CNPJ deve ter 14 dígitos"),
        tel: yup.string().required("Informe um número válido"),
        email: yup.string().email("Informe um email válido"),
        cep: yup.string().length(9, "CEP deve possuir 8 dígitos")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, logout } = useContext(UtilsContext)

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [cnpj, setCNPJ] = useState("");
    const [cep, setCEP] = useState("");
    const [endereco, setEndereco] = useState("");
    const [cidade, setCidade] = useState("");
    const [num, setNum] = useState("");
    const [bairro, setBairro] = useState("");
    const [id, setId] = useState();

    useEffect(() => {
        recuperarDados();
    }, [])

    async function recuperarDados() {
        let resp = await api.get('/mecanica');
        resp = resp.data[0]
        if (resp.mec_id != null)
            setId(resp.mec_id);
        if (resp.mec_nome != null) {
            setNome(resp.mec_nome);
            setValue("nome", resp.mec_nome);
        }
        if (resp.mec_email != null) {
            setEmail(resp.mec_email);
            setValue("email", resp.mec_email);
        }
        if (resp.mec_tel != null) {
            setTel(resp.mec_tel);
            setValue("tel", resp.mec_tel)
        }
        if (resp.mec_cnpj != null) {
            setCNPJ(resp.mec_cnpj);
            setValue("cnpj", resp.mec_cnpj);
        }
        if (resp.mec_cep != null)
            setCEP(resp.mec_cep);
        if (resp.mec_endereco != null)
            setEndereco(resp.mec_endereco);
        if (resp.mec_cidade != null)
            setCidade(resp.mec_cidade);
        if (resp.mec_num != null)
            setNum(resp.mec_num);
        if (resp.mec_bairro != null)
            setBairro(resp.mec_bairro);
    }


    async function editarDados() {
        if (nome != "" && email != "" && cep != "") {
            if (errors.nome == undefined && errors.email == undefined && errors.cep == undefined) {
                const resp = await api.put('/mecanica', {
                    id, nome, email, tel, cnpj, cep, endereco, num, bairro, cidade
                })
                if (resp.data.status)
                    alerta('mensagemForm mensagemForm-Sucesso', 'Dados atualizados com sucesso!');
                else
                    alerta('mensagemForm mensagemForm-Erro', 'Erro. Não foi possível atualizar os dados no momento!');
            }
            else
                alerta('mensagemForm mensagemForm-Alerta', 'Atenção. Preencha os campos corretamente!');
        }
        else
            alerta('mensagemForm mensagemForm-Erro', 'Erro. Preencha os campos obrigatórios!');

    }

    const verificaCep = (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length == 8) {
            apiCEP.get('/' + cep + '/json/').then((resp) => {
                if (resp.statusText == "OK") {
                    setCidade(resp.data.localidade);
                    setEndereco(resp.data.logradouro);
                    setBairro(resp.data.bairro);
                }
            })
        }
    }

    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Perfil</h2>
                        <BtSair onClick={logout} />
                        <div className="line"></div>

                        <div align="center" style={{ marginTop: '4rem' }}>
                            <form className='row g-2 col-md-5'>
                                <Form.Input type="text" cols="col-md-12" align="justify" id="nome" name="nome" placeholder="" label="Nome Fantasia *"
                                    value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }} erro={errors.nome} register={register} />
                                <Form.Input type="text" cols="col-md-12" align="justify" id="email" name="email" placeholder="" label="Email *"
                                    value={email} onChange={e => { setEmail(e.target.value); setValue("email", e.target.value); errors.email && trigger('email'); }} erro={errors.email} register={register} />
                                <Form.Input type="text" cols="col-md-6" align="justify" id="cnpj" name="cnpj" placeholder="" label="CNPJ"
                                    value={cnpj} onChange={e => { setCNPJ(e.target.value); setValue("cnpj", e.target.value); errors.cnpj && trigger('cnpj'); }} mascara="99.999.999/0001-99" erro={errors.cnpj} register={register} />
                                <Form.Input type="text" cols="col-md-6" align="justify" id="tel" name="tel" placeholder="" label="Telefone"
                                    value={tel} mascara="(99)9999-9999" onChange={e => { setTel(e.target.value); setValue("tel", e.target.value); errors.tel && trigger('tel'); }} erro={errors.tel} register={register} />
                                <Form.Input mascara="99999-999" type="text" cols="col-md-6" align="justify" id="cep" name="cep" placeholder="" label="CEP *"
                                    value={cep} onChange={e => { setCEP(e.target.value); setValue("cep", e.target.value); errors.cep && trigger('cep'); }} onBlur={verificaCep} erro={errors.cep} register={register} />
                                <Form.Input type="text" cols="col-md-6" align="justify" id="cidade" name="cidade" placeholder="" label="Cidade"
                                    value={cidade} onChange={e => { setCidade(e.target.value) }} />
                                <Form.Input type="text" cols="col-md-8" align="justify" id="endereco" name="endereco" placeholder="" label="Endereço"
                                    value={endereco} onChange={e => { setEndereco(e.target.value) }} />
                                <Form.Input type="number" cols="col-md-4" align="justify" id="num" name="num" placeholder="" label="Num"
                                    value={num} onChange={e => { setNum(e.target.value) }} />
                                {msgForm != '' && <p className={classes}> {msgForm} </p>}
                                <div align="right">
                                    <Button className="col-md-3" variant="secondary" onClick={() => { recuperarDados(); clearErrors(); }} style={{ margin: '0.25rem' }}>
                                        Cancelar
                                    </Button>
                                    <Button className="col-md-3" variant="primary" onClick={(e) => { editarDados() }} >
                                        Confirmar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Perfil;