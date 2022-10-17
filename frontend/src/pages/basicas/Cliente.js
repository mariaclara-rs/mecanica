import React, { useEffect, useState, useContext } from 'react';

import { UtilsContext } from '../../context/UtilsContext'

import api from '../../services/api';
import apiCEP from '../../services/cep';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import Form from '../../components/Form'
import Search from '../../components/Search'
import ModalExcluir from '../../components/ModalExcluir';

import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputMask from "react-input-mask";
import * as yup from "yup";

import { BiGroup } from "react-icons/bi";
import { FiTrash, FiEdit } from 'react-icons/fi';

function Cliente() {

  const [cpf, setCPF] = useState('');
  const [nome, setNome] = useState('');
  const [cep, setCEP] = useState('');
  const [endereco, setEndereco] = useState('');
  const [tel, setTel] = useState('');
  const [num, setNum] = useState('');
  const [cidade, setCidade] = useState('');
  const [email, setEmail] = useState('');

  const [modal, setModal] = useState(false);
  const [cli, setCli] = useState([]);
  const [add, setAdd] = useState(true);
  const [id, setId] = useState('');

  const [modalExcluir, setModalExcluir] = useState(false);

  const [nomeTemp, setNomeTemp] = useState('');
  const [campoBusca, setCampoBusca] = useState('');

  const { sleep, alerta, msgForm, setMsgForm, classes, setClasses } = useContext(UtilsContext)

  const schema = yup.object({
    nome: yup.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    cpf: yup.string().length(14, "CPF deve ter 11 dígitos"),
    tel: yup.string().min(8, "Informe um número válido").max(11, "Informe um número válido"),
    cidade: yup.string().required("Preencha a cidade"),
    endereco: yup.string().required("Preencha o endereço"),
    email: yup.string().email("Informe um email válido").required("Informe o email")
  }).required();


  const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });
  //mode:'onChange',


  useEffect(() => {
    carregarClientes();

  }, []);

  async function carregarClientes() {
    const resp = await api.get('/clientes');
    setCli(resp.data);
  }


  async function gravarCliente(e) {

    e.preventDefault();
    //console.log("nome: " + nome + " telefone: " + tel + " cpf: " + cpf)
    if (nome.length > 0 && cpf.length > 0 && tel.length > 0 && email.length>0) {
      if (errors.nome == undefined && errors.cpf == undefined && errors.tel == undefined && errors.email==undefined) {
        let resp;
        if (add) {
          //console.log("cpf: " + cpf + "\nnome: " + nome + "\ncep:" + cep);
          resp = await api.post('/clientes/cadastrar', {
            cpf, nome, email,
            cep, endereco,
            tel, num,
            cidade
          });

          if (JSON.stringify(resp.data.status) == 'false') {
            alerta('mensagemForm mensagemForm-Erro', 'Cliente já existente!');
          }
          else {
            limparCampos();
            alerta('mensagemForm mensagemForm-Sucesso', 'Cliente cadastrado!');
          }
        }
        else {
          resp = await api.put('clientes/editar/', {
            id, cpf, nome, email,
            cep, endereco,
            tel, num,
            cidade
          });
          setAdd(true);
          if (JSON.stringify(resp.data.status) == 'false') {
            alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar cliente!');
          }
          else {
            alerta('mensagemForm mensagemForm-Sucesso', 'Dados atualizados!');
            limparCampos();
          }
        }
        carregarClientes();
      }
      else {
        alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
      }
    }
    else {
      alerta('mensagemForm mensagemForm-Alerta', 'Preencha os campos obrigatórios!');
    }
  }

  async function editarCliente(cli_id, i) {
    setId(cli_id);
    carregarCampos(i);
    setAdd(false);
    setModal(true);
  }

  async function excluirCliente() {
    const resp = await api.delete('/clientes/' + id);
    if (JSON.stringify(resp.data.status) == 'false') {
      alerta('mensagemForm mensagemForm-Erro', 'Impossível excluir cliente').then(() => { setModalExcluir(false); setNomeTemp('') })
    }
    else {
      alerta('mensagemForm mensagemForm-Sucesso', 'Cliente excluído').then(() => { setModalExcluir(false); setNomeTemp(''); })

    }
    carregarClientes();
  }

  const verificaCep = (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length == 8) {
      apiCEP.get('/' + cep + '/json/').then((resp) => {
        if (resp.statusText == "OK") {
          setCidade(resp.data.localidade);
          setEndereco(resp.data.logradouro);
          setValue("cidade", resp.data.localidade);
          setValue("endereco", resp.data.logradouro);
        }
      })
    }
  }

  function limparCampos() {
    setCPF('');
    setValue("cpf", "");
    setNome('');
    setValue("nome", "");
    setCEP('');
    setValue("cep", "");
    setEndereco('');
    setValue("endereco", "");
    setTel('');
    setValue("tel", "");
    setNum('');
    setValue("num", "");
    setCidade('');
    setValue("cidade", "");
    setEmail("")
    setValue("email", "")
    setAdd(true);
  }
  function carregarCampos(i) {
    setCPF(cli[i].cli_cpf);
    setNome(cli[i].cli_nome);
    setCEP(cli[i].cli_cep);
    setEndereco(cli[i].cli_endereco);
    setTel(cli[i].cli_tel);
    setNum(cli[i].cli_num);
    setCidade(cli[i].cli_cidade);
    setEmail(cli[i].cli_email)
    setValue("cpf", cli[i].cli_cpf);
    setValue("nome", cli[i].cli_nome);
    setValue("cep", cli[i].cli_cep);
    setValue("endereco", cli[i].cli_endereco);
    setValue("tel", cli[i].cli_tel);
    setValue("num", cli[i].cli_num);
    setValue("cidade", cli[i].cli_cidade);
    setValue("email", cli[i].cli_email)
  }


  const formatCharsPlaca = {
    'L': '[.0-9]',
    'N': '[0-9]',
    'X': '[a-z0-9A-Z]'
  };

  async function buscarCliente() {
    let resp;
    let params;
    if (campoBusca != '') {
      params = {
        nome: campoBusca
      };
      resp = await api.get('/clientes/nome', {
        params
      })
      setCli(resp.data.data);
    }
    else {
      carregarClientes();
    }
  }

  return (
    <React.Fragment>

      <div className="wrapper">
        <Sidebar />
        <div id="content">
          <div className="container-fluid col-md-12 m-2">
            <h2 className="h2-titulo-secao">Clientes <BiGroup size={25} style={{ margin: '0.3rem' }} /></h2>
            <div className="line"></div>

            {/*botão modal*/}
            <button type="button" className="btn btn-dark" data-toggle="modal"
              onClick={() => { clearErrors(); limparCampos(); setModal(true) }}>
              Adicionar +
            </button>

            {/*Campo de busca*/}
            <div className="row mt-5 mb-3">
              <div className="col-md-5">
                <Search>
                  <Search.Input placeholder="Busque por um cliente..." value={campoBusca} onChange={e => { setCampoBusca(e.target.value); buscarCliente(); }} onBlur={buscarCliente} />
                  <Search.Span onClick={() => { buscarCliente() }} />
                </Search>
              </div>
            </div>


            <table className="table table-hover" style={{ overflow: 'auto' }} >
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Endereço</th>
                  <th scope="col">Ação</th>
                </tr>
              </thead>
              <tbody>
                {cli.map((c, i) => (
                  <tr key={i}>
                    <th scope="row">{c.cli_id}</th>
                    <td>{c.cli_nome}</td>
                    <td>{c.cli_email}</td>
                    <td>{c.cli_tel}</td>
                    <td>{c.cli_endereco}</td>
                    <td >
                      <Button className='m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { limparCampos(); clearErrors(); editarCliente(c.cli_id, i) }}>
                        <FiEdit className='btEditar' />
                      </Button>
                      <Button
                        className='m-0 p-0 px-1 border-0 bg-transparent'>
                        <FiTrash className='btExcluir' onClick={() => { setId(c.cli_id); setNomeTemp(c.cli_nome); setModalExcluir(true) }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>


        </div>
      </div>

      <React.Fragment>
        <Modal className="col-6" show={modal} onHide={() => { setModal(false) }}>
          <Modal.Header className='modal-title' closeButton >{add ? "Cadastro de Cliente" : "Editar Cliente"}</Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Input type="text" cols="col-md-12" id="nome" name="nome" placeholder="Ex: José Silva" label="Nome do Cliente *" register={register}
                value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }} erro={errors.nome} />
              <Form.Input type="text" cols="col-md-12" id="email" name="email" placeholder="Ex: josesilva@example.com" label="Email *" register={register}
                value={email} onChange={e => { setEmail(e.target.value); setValue("email", e.target.value); errors.email && trigger('email'); }} erro={errors.email} />

              {add
                ? <Form.Input mascara="999.999.999-99" type="text" cols="col-md-6" id="cpf" name="cpf" placeholder="111.111.111-11" label="CPF *"
                  register={register} value={cpf} onChange={e => { setCPF(e.target.value); setValue("cpf", e.target.value); errors.cpf && trigger('cpf') }} erro={errors.cpf} />
                :
                <Form.Input readOnly mascara="999.999.999-99" type="text" cols="col-md-6" id="cpf" name="cpf" placeholder="111.111.111-11" label="CPF *"
                  register={register} value={cpf} onChange={e => { setCPF(e.target.value); setValue("cpf", e.target.value); errors.cpf && trigger('cpf') }} erro={errors.cpf} />
              }


              <Form.Input type="number" cols="col-md-6" id="tel" name="tel" placeholder="..." label="Telefone *" register={register}
                value={tel} onChange={e => { setTel(e.target.value); setValue("tel", e.target.value); errors.tel && trigger('tel'); }} erro={errors.tel} />


              <div className="col-md-6">
                <label htmlFor="cep">CEP</label>
                <InputMask mask="99999-999" maskChar="" type="text" id="cep" name="cep" placeholder="11111-11" className="form-control" {...register("cep")}
                  value={cep} onChange={e => { setCEP(e.target.value); setValue("cep", e.target.value); errors.cep && trigger('cep') }} onBlur={verificaCep} />
                {errors.cep && <p className="erroForm">{errors.cep?.message}</p>}
              </div>

              <Form.Input type="text" cols="col-md-6" id="cidade" name="cidade" placeholder="..." label="Cidade" register={register}
                value={cidade} onChange={e => { setCidade(e.target.value); setValue("cidade", e.target.value); errors.cidade && trigger('cidade') }} erro={errors.cidade} />

              <Form.Input type="text" cols="col-md-9" id="endereco" name="endereco" placeholder="..." label="Endereco" register={register}
                value={endereco} onChange={e => { setEndereco(e.target.value); setValue("endereco", e.target.value); errors.endereco && trigger('endereco') }} erro={errors.endereco} />

              <Form.Input type="number" cols="col-md-3" id="num" name="num" placeholder="..." label="Nº"
                value={num} onChange={e => setNum(e.target.value)} register={register} />
            </Form>

            {msgForm != '' && <p className={classes}> {msgForm} </p>}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setModal(false); limparCampos() }}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarCliente(e)) }} >
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>


      <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
        item="cliente" valor={nomeTemp} classesMsg={classes} msg={msgForm}
        onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirCliente() }} />

    </React.Fragment>

  );
}

export default Cliente;
