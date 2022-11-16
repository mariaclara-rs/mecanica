import React, { useEffect, useState, useContext } from 'react';

import { UtilsContext } from '../../context/UtilsContext'

import api from '../../services/api';
import apiCEP from '../../services/cep';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import Form from '../../components/Form'
import AreaSearch from '../../components/AreaSearch';
import ModalExcluir from '../../components/ModalExcluir';

import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputMask from "react-input-mask";
import * as yup from "yup";

import { BiGroup } from "react-icons/bi";
import { FiTrash, FiEdit, FiEye } from 'react-icons/fi';

import BtSair from '../../components/BtSair';
import ToastMessage from '../../components/ToastMessage';

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

  const [toast, setToast] = useState(false);
  const [classeToast, setClasseToast] = useState();
  const [msgToast, setMsgToast] = useState("");
  const [tituloToast, setTituloToast] = useState("");

  const [visualizar, setVisualizar] = useState(false);

  const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, logout } = useContext(UtilsContext)

  const schema = yup.object({
    nome: yup.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    cpf: yup.string().length(14, "CPF deve ter 11 dígitos"),
    tel: yup.string().length(14, "Informe um número válido"),
    email: yup.string().email("Informe um email válido")
  }).required();


  const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });
  //mode:'onChange',


  useEffect(() => {
    carregarClientes();

  }, []);


  async function carregarClientes() {
    const resp = await api.get('/clientes');
    if (campoBusca.length > 0)
      setCli(resp.data.filter(c => c.cli_nome.toUpperCase().includes(campoBusca.toUpperCase())))
    else
      setCli(resp.data)
  }


  async function gravarCliente(e) {
    e.preventDefault();
    if (nome.length > 0 && cpf.length > 0 && tel.length > 0) {
      if (errors.nome == undefined && errors.cpf == undefined && errors.tel == undefined) {
        let resp;
        if (add) {
          resp = await api.post('/clientes/cadastrar', {
            cpf, nome, email,
            cep, endereco,
            tel, num,
            cidade
          });

          if (JSON.stringify(resp.data.status) == 'false') {
            alerta('mensagemForm mensagemForm-Erro', 'Erro. Não foi possível cadastrar o cliente!');
          }
          else {
            limparCampos();
            setToast(false);
            setTituloToast("Cadastro")
            setMsgToast("Cliente cadastrado com sucesso!");
            setClasseToast('Success');
            setToast(true);
            setModal(false);
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
            setToast(false);
            setTituloToast("Edição")
            setMsgToast("Dados atualizado com sucesso!");
            setClasseToast('Success');
            setToast(true);
            limparCampos();
            setModal(false);
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

  async function visualizarCliente(cli_id, i) {
    carregarCampos(i);
    setModal(true);
  }

  async function excluirCliente() {
    const resp = await api.delete('/clientes/' + id);
    if (JSON.stringify(resp.data.status) == 'false') {
      setToast(false);
      setTituloToast("Exclusão")
      setMsgToast("Erro. Não foi possível excluir o cliente");
      setClasseToast('Danger');
      setToast(true);
      setModalExcluir(false);
      setNomeTemp('');
    }
    else {
      setToast(false);
      setTituloToast("Exclusão")
      setMsgToast("Cliente excluído");
      setClasseToast('Success');
      setToast(true);
      setModalExcluir(false);
      setNomeTemp('');

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
    if (cli[i].cli_cpf != null) {
      setCPF(cli[i].cli_cpf);
      setValue("cpf", cli[i].cli_cpf);
    } else {
      setCPF('');
      setValue("cpf", '');
    }
    if (cli[i].cli_nome != null) {
      setNome(cli[i].cli_nome);
      setValue("nome", cli[i].cli_nome);
    } else {
      setNome('');
      setValue("nome", '');
    }
    if (cli[i].cli_cep != null) {
      setCEP(cli[i].cli_cep);
      setValue("cep", cli[i].cli_cep);
    } else {
      setCEP('');
      setValue("cep", '');
    }
    if (cli[i].cli_endereco != null) {
      setEndereco(cli[i].cli_endereco);
      setValue("endereco", cli[i].cli_endereco);
    } else {
      setEndereco('');
      setValue("endereco", '');
    }
    if (cli[i].cli_tel != null) {
      setTel(cli[i].cli_tel);
      setValue("tel", cli[i].cli_tel);
    } else {
      setTel('');
      setValue("tel", '');
    }
    if (cli[i].cli_num != null) {
      setNum(cli[i].cli_num);
      setValue("num", cli[i].cli_num);
    } else {
      setNum('');
      setValue("num", '');
    }
    if (cli[i].cli_cidade != null) {
      setCidade(cli[i].cli_cidade);
      setValue("cidade", cli[i].cli_cidade);
    } else {
      setCidade('');
      setValue("cidade", '');
    }
    if (cli[i].cli_email != null) {
      setEmail(cli[i].cli_email)
      setValue("email", cli[i].cli_email)
    } else {
      setEmail('')
      setValue("email", '')
    }
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
            <BtSair onClick={logout} />
            <div className="line"></div>

            {/*botão modal*/}
            <button type="button" className="btn btn-dark" data-toggle="modal"
              onClick={() => { clearErrors(); limparCampos(); setModal(true) }}>
              Adicionar +
            </button>

            {/*Campo de busca*/}

            <AreaSearch placeholder="Busque por um cliente..."
              value={campoBusca} onKeyUp={carregarClientes} onChange={(e) => setCampoBusca(e.target.value)} onClick={carregarClientes} />

            <div style={{ overflowY: 'auto', height: '22em' }}>
              <table className="table table-hover"  >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Email</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {cli.map((c, i) => (
                    <tr key={i}>
                      <th scope="col">{c.cli_id}</th>
                      <td>{c.cli_nome}</td>
                      <td>{c.cli_email}</td>
                      <td>{c.cli_tel}</td>
                      <td>{c.cli_endereco}</td>
                      <td >
                        <Button data-toggle="tooltip" data-placement="bottom" title="Visualizar" className='m-0 p-0 px-1 border-0 bg-transparent btn-dark' onClick={() => { setVisualizar(true); visualizarCliente(c.cli_id, i); }}>
                          <FiEye className='btComum' />
                        </Button>
                        <Button data-toggle="tooltip" data-placement="bottom" title="Editar" className='m-0 p-0 px-1 border-0 bg-transparent btn-dark' onClick={() => { limparCampos(); clearErrors(); editarCliente(c.cli_id, i) }}>
                          <FiEdit className='btComum' />
                        </Button>
                        <Button data-toggle="tooltip" data-placement="bottom" title="Excluir"
                          className='m-0 p-0 px-1 border-0 bg-transparent btn-danger'>
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
      </div>

      <React.Fragment>
        <Modal className="col-6" show={modal} onHide={() => { setModal(false); setVisualizar(false); clearErrors(); }}>
          <Modal.Header className='modal-title' closeButton >
            {
              visualizar ? "Visualizar Cliente" : add ? "Cadastro de Cliente" : "Editar Cliente"
            }
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Input leitura={visualizar} type="text" cols="col-md-12" id="nome" name="nome" placeholder="Ex: José Silva" label="Nome do Cliente *" register={register}
                value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }} erro={errors.nome} />
              <Form.Input leitura={visualizar} type="text" cols="col-md-12" id="email" name="email" placeholder="Ex: josesilva@example.com" label="Email" register={register}
                value={email} onChange={e => { setEmail(e.target.value); setValue("email", e.target.value); errors.email && trigger('email'); }} erro={errors.email} />

              <Form.Input leitura={visualizar} mascara="999.999.999-99" type="text" cols="col-md-6" id="cpf" name="cpf" placeholder="111.111.111-11" label="CPF *"
                register={register} value={cpf} onChange={e => { setCPF(e.target.value); setValue("cpf", e.target.value); errors.cpf && trigger('cpf') }} erro={errors.cpf} />

              <Form.Input leitura={visualizar} mascara="(99)99999-9999" type="text" cols="col-md-6" id="tel" name="tel" placeholder="..." label="Celular *" register={register}
                value={tel} onChange={e => { setTel(e.target.value); setValue("tel", e.target.value); errors.tel && trigger('tel'); }} erro={errors.tel} />


              <div className="col-md-6">
                <label htmlFor="cep">CEP</label>
                {visualizar ?
                  <InputMask disabled aria-disabled mask="99999-999" maskChar="" type="text" id="cep" name="cep" placeholder="11111-11" className="form-control" {...register("cep")}
                    value={cep} onChange={e => { setCEP(e.target.value); setValue("cep", e.target.value); errors.cep && trigger('cep') }} onBlur={verificaCep} />
                  :
                  <InputMask aria-disabled mask="99999-999" maskChar="" type="text" id="cep" name="cep" placeholder="11111-11" className="form-control" {...register("cep")}
                    value={cep} onChange={e => { setCEP(e.target.value); setValue("cep", e.target.value); errors.cep && trigger('cep') }} onBlur={verificaCep} />
                }
                {errors.cep && <p className="erroForm">{errors.cep?.message}</p>}

              </div>

              <Form.Input leitura={visualizar} type="text" cols="col-md-6" id="cidade" name="cidade" placeholder="..." label="Cidade" register={register}
                value={cidade} onChange={e => { setCidade(e.target.value); setValue("cidade", e.target.value); errors.cidade && trigger('cidade') }} erro={errors.cidade} />

              <Form.Input leitura={visualizar} type="text" cols="col-md-9" id="endereco" name="endereco" placeholder="..." label="Endereco" register={register}
                value={endereco} onChange={e => { setEndereco(e.target.value); setValue("endereco", e.target.value); errors.endereco && trigger('endereco') }} erro={errors.endereco} />

              <Form.Input leitura={visualizar} type="number" cols="col-md-3" id="num" name="num" placeholder="..." label="Nº"
                value={num} onChange={e => setNum(e.target.value)} register={register} />
            </Form>

            {msgForm != '' && <p className={classes}> {msgForm} </p>}

          </Modal.Body>
          <Modal.Footer>
            {visualizar ?
              <>
                <Button disabled variant="secondary">
                  Cancelar
                </Button>
                <Button disabled type="submit" variant="primary" >
                  Confirmar
                </Button>
              </>
              :
              <>
                <Button variant="secondary" onClick={() => { setModal(false); limparCampos() }}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarCliente(e)) }} >
                  Confirmar
                </Button>
              </>
            }

          </Modal.Footer>
        </Modal>
      </React.Fragment>


      <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
        item="cliente" valor={nomeTemp} classesMsg={classes} msg={msgForm}
        onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirCliente() }} />

      <ToastMessage show={toast} titulo={tituloToast} onClose={() => setToast(false)}
        classes={classeToast} msg={msgToast} />

    </React.Fragment>

  );
}

export default Cliente;
