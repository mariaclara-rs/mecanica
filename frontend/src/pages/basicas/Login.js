import React, { useEffect, useState, useRef, useContext } from 'react';
import api from '../../services/api';
import UtilsContext from '../../context/UtilsContext';
import styles from './Login.css'
import 'react-bootstrap'
import Form from '../../components/Form';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { HiOutlineChevronDoubleRight } from "react-icons/hi"
import { useNavigate } from "react-router-dom";

function Login() {

    const schema = yup.object({
        usuario: yup.string().matches(/^[a-z]+$/, "Informe o nome de usuario válido"),
        senha: yup.string().required("Informe a senha")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, reset, formState: { errors, isValid } } = useForm({
        mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema),
    });
    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses } = useContext(UtilsContext)
    const navigate = useNavigate();


    useEffect(() => {

    }, [isValid]);
    const form = useRef();
    async function logar(data) {
        console.log("data: " + JSON.stringify(data))
        const params = {
            login: data.usuario,
            senha: data.senha,
        };
        const resp = await api.get('/login', { params })
        console.log(resp.data.status + " " + JSON.stringify(resp.data))
        if (resp.data.status) {
            api.defaults.headers = { 'Authorization': resp.data.token }
            localStorage.setItem("token", resp.data.token)
            navigate("/clientes")
        }
        else {
            alerta('mensagemForm mensagemForm-Erro', 'Usuário ou senha incorretos!');
        }

    }

    return (
        <>
            <div className='bg' ></div>
            <div className='centralizar' style={{ backgroundColor: '#fff' }}>

                <form ref={form} className='row g-3 justify-content-center centralizarVerticalForm' onSubmit={handleSubmit(logar)}>
                    <h2 className='h2-titulo-secao' align="center">LOGIN</h2>

                    <Form.Input type="text" cols="col-md-7" id="usuario" name="usuario" placeholder="Informe o usuário..." label="Usuário" register={register}
                        onChange={e => { setValue("usuario", e.target.value); errors.usuario && trigger('usuario'); }} erro={errors.usuario} />
                    <Form.Input type="password" cols="col-md-7 mb-3 " id="senha" name="senha" placeholder="Informe sua senha..." label="Senha" register={register}
                        onChange={e => { setValue("senha", e.target.value); errors.senha && trigger('senha'); }} erro={errors.senha} />
                    {msgForm != '' &&
                        <div className='col-md-7' style={{ marginTop: '0.2em', marginBottom: '0.2em' }}>
                            <p className={classes}> {msgForm} </p>
                        </div>
                    }
                    <button type="submit" className='col-md-7 btn btn-dark'>Entrar <HiOutlineChevronDoubleRight /></button>
                </form>
            </div>

        </>

    )
}
export default Login;