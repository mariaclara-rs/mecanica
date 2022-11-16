import { text } from '@fortawesome/fontawesome-svg-core';
import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function formatarData(data) {
    if (data == "" || data == null)
        return "";
    data = (data.split('T')[0]).split('-');
    return data[2] + '/' + data[1] + '/' + data[0];
}

function cliente(ordemservico) {
    return [
        {
            table: {
                widths: ['auto', '*'],
                body: [
                    [{ text: 'Cliente:', style: 'header' }, ordemservico.cli_nome],
                ]
            },
            margin: [0, 10, 0, 10]
        }
    ]
}

function veiculo(ordemservico) {
    return [
        { text: 'Veículo', style: 'header' },
        {
            table: {
                widths: ['*', '*', '*'],
                body: [
                    [{ text: 'Placa', style: 'header' }, { text: 'Marca', style: 'header' }, { text: 'Kilometragem (km)', style: 'header' }],
                    [ordemservico.ve_placa, ordemservico.mc_nome, ordemservico.os_vekm]
                ]
            },
            margin: [0, 0, 0, 10]
        }
    ]
}

function metodoRecebimento(metodo) {
    if (metodo == "CC")
        return "Cartão de crédito";
    if (metodo == "CD")
        return "Cartão de débito";
    if (metodo == "D")
        return "Dinheiro";
    if (metodo == "P")
        return "PIX";
    if (metodo == "C")
        return "Cheque";
    return "";
}

function fechamento(ordemservico) {
    if (ordemservico.os_dataFechamento != null) {
        var dtFechamento = formatarData(ordemservico.os_dataFechamento);
        return [{
            columns: [
                {
                    width: 'auto',
                    text: 'Data de Fechamento:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: dtFechamento
                }
            ]
        },
        {
            table: {
                widths: ['*', '*', '*', '*'],
                body: [
                    [{ text: 'Método de Recebimento:', style: 'header' }, metodoRecebimento(ordemservico.os_metodoReceb),
                    { text: 'Quantidade de Parcelas', style: 'header' }, ordemservico.os_qtdeParcelas],

                    [{ text: 'Valor Recebido:', style: 'header' }, ordemservico.os_valTot - ordemservico.os_valFiado,
                    { text: 'Valor fiado:', style: 'header' }, ordemservico.os_valFiado]
                ]
            },
            margin: [0, 10, 0, 10]
        }
        ]
    }
}

function HistoricoPagamentoOS(ordemservico, contareceber,mecanica) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    let textFooter = "";
    if (mecanica != null) {
        if(mecanica.mec_nome!="")   
            textFooter+=mecanica.mec_nome+"\n";
        if(mecanica.mec_endereco!="")
            textFooter+=mecanica.mec_endereco+", ";
        if(mecanica.mec_num!="")
            textFooter+=mecanica.mec_num+" - ";
        if(mecanica.mec_bairro!="")
            textFooter+=mecanica.mec_bairro;
        if(mecanica.mec_cidade!="")
            textFooter+="\n"+mecanica.mec_cidade
    }

    const contasgeradas = contareceber.map((cr) => {
        var cg = [
            { text: cr.cr_valor },
            { text: cr.cr_valorReceb },
            { text: metodoRecebimento(cr.cr_metodoReceb) },
            { text: formatarData(cr.cr_dtVenc) },
            { text: formatarData(cr.cr_dtReceb) }
        ]
        if (cr.cr_metodoReceb == null)
            cg.push({ text: "Em aberta", color: 'red' })
        else
            cg.push({ text: "Paga", color: 'green' })
        return cg;
    });

    const header = [{
        text: 'Histórico de Pagamento da OS #' + ordemservico.os_id,
        fontSize: 15,
        bold: true,
        margin: [40, 20, 20, 20] //left, top, right e bottom
    }];
    const content = [
        {
            columns: [
                {
                    alignment: 'left',
                    width: 'auto',
                    text: 'Data de abertura:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: formatarData(ordemservico.os_dataAbertura)
                }
            ]
        },

        cliente(ordemservico),
        veiculo(ordemservico),
        {
            columns: [
                {
                    width: 'auto',
                    text: 'Valor Total da O.S.:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: ordemservico.os_valTot
                }
            ],
            margin: [0, 2, 0, 5]
        },
        fechamento(ordemservico),
        { text: 'Contas Geradas', style: 'header' },
        {
            table: {
                widths: ['*', '*', '*', '*', '*', '*'],
                body: [
                    [{ text: 'Valor Total (R$)', style: 'header' },
                    { text: 'Valor Recebido (R$)', style: 'header' },
                    { text: 'Método de Recebimento', style: 'header' },
                    { text: 'Vencimento', style: 'header' },
                    { text: 'Recebimento', style: 'header' },
                    { text: 'Situação', style: 'header' }
                    ],
                    ...contasgeradas
                ]
            },
            margin: [0, 0, 0, 10]
        }
    ];
    const footer = [];

    const doc = {
        pageSize: 'A4',
        header: [header],
        background: [{
            image: 'fundo',
            alignment: 'center',
            opacity: 0.2,
            margin: [0, 100, 0, 0]
        }],
        images: {
            fundo: 'https://media.istockphoto.com/vectors/wrench-and-screwdriver-tools-drawing-vector-id492669132?k=20&m=492669132&s=170667a&w=0&h=00tAGt_sHXbpdWtYPKy2cG_dK7LpMxB2azYh9eAYkhk=',
        },
        content: [content],
        footer: {
            columns: [
                {
                    alignment: 'center',
                    text: textFooter,
                    color: 'gray'
                }
            ],
            margin: [0, -25, 0, 0]
        },
        styles: {
            header: {
                fontSize: 12,
                bold: true
            }
        },
        defaultStyle: {
            columnGap: 5
        }
    }

    pdfMake.createPdf(doc).open();
}
export default HistoricoPagamentoOS;