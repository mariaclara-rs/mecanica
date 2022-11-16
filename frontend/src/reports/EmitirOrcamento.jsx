import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function aredondar(val) {
    return Math.round(val * 100) / 100
}

function totalServicos(servicos) {
    var soma = 0;
    servicos.map((ser) => {
        soma += ser.serOS_val;
    })
    return aredondar(soma);
}
function totalPecas(pecas) {
    var soma = 0;
    pecas.map((pec) => {
        soma += pec.pecOS_valTot;
    })
    return aredondar(soma);
}
function formatarData(data) {
    data = (data.split('T')[0]).split('-');
    return data[2] + '/' + data[1] + '/' + data[0];
}

function EmitirOS(ordemservico, servicos, pecas, mecanica) {
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

    var desc = 0;
    var orig = 0;
    const dataservicos = servicos.map((s) => {
        var precoReal = Number(s.ser_maoObra);
        var precoCobrado = Number(s.serOS_val / s.serOS_qtde)
        var maoObra = s.ser_maoObra;
        if (precoReal > precoCobrado)
            desc += (precoReal - precoCobrado) * s.serOS_qtde;
        else if (precoCobrado > precoReal) {
            maoObra = precoCobrado
        }
        orig += maoObra * s.serOS_qtde;
        return [
            { text: s.ser_nome },
            { text: aredondar(maoObra) },
            { text: (precoReal > precoCobrado) ? aredondar(precoReal - precoCobrado) : 0 },
            { text: aredondar(precoCobrado) },
            { text: s.serOS_qtde },
            { text: aredondar(s.serOS_val) }
        ]
    });
    const datapecas = pecas.map((p) => {
        var precoReal = Number(p.pec_preco);
        var precoCobrado = Number(p.pecOS_valTot / p.pecOS_qtde)
        var preco = precoReal;
        if (precoReal > precoCobrado)
            desc += (precoReal - precoCobrado) * p.pecOS_qtde;
        else if (precoCobrado > precoReal) {
            preco = precoCobrado
        }
        orig += preco * p.pecOS_qtde;
        return [
            { text: p.pec_nome },
            { text: aredondar(preco) },
            { text: (precoReal > precoCobrado) ? aredondar(precoReal - precoCobrado) : 0 },
            { text: aredondar(p.pecOS_valTot / p.pecOS_qtde) },
            { text: p.pecOS_qtde },
            { text: aredondar(p.pecOS_valTot) }
        ]
    })
    console.log("desc: " + desc + " orig: " + orig)
    const header = [{
        text: 'Orçamento #' + ordemservico.os_id,
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
                    text: 'Data do orçamento:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: formatarData(ordemservico.os_dataAbertura)
                }
            ]
        },
        {
            table: {
                widths: ['auto', '*'],
                body: [
                    [{ text: 'Cliente:', style: 'header' }, ordemservico.cli_nome],
                ]
            },
            margin: [0, 10, 0, 10]
        },
        { text: 'Serviços', style: 'header' },
        {
            table: {
                widths: ['*', '*', '*', '*', '*', '*'],
                body: [
                    ['Nome', 'Valor Unitário', 'Desconto', 'Valor Final', 'Quantidade', 'Valor Total'],
                    ...dataservicos
                ]
            }
        },
        {
            table: {
                widths: ['auto', '*'],
                body: [
                    [{ text: 'Total', border: [true, false, true, true] },
                    { text: totalServicos(servicos), border: [true, false, true, true] }]
                ]
            },
            margin: [0, 0, 0, 10]
        },
        { text: 'Peças', style: 'header' },
        {
            table: {
                widths: ['*', '*', '*', '*', '*', '*'],
                body: [
                    ['Nome', 'Valor Unitário', 'Desconto', 'Valor Final', 'Quantidade', 'Valor Total'],
                    ...datapecas
                ]
            }
        },
        {
            table: {
                widths: ['auto', '*'],
                body: [
                    [{ text: 'Total', border: [true, false, true, true] },
                    { text: totalPecas(pecas), border: [true, false, true, true] }]
                ]
            },
            margin: [0, 0, 0, 10]
        },
        {
            columns: [
                {
                    width: 'auto',
                    text: 'Valor Total:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: orig
                }
            ],
            margin: [0, 2, 0, 5]
        },
        {
            columns: [
                {
                    width: 'auto',
                    text: 'Descontos:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: aredondar(desc)
                }
            ],
            margin: [0, 2, 0, 5]
        },
        {
            columns: [
                {
                    width: 'auto',
                    text: 'Valor Final:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: aredondar(ordemservico.os_valTot)
                }
            ],
            margin: [0, 2, 0, 5]
        }

    ];

    const doc = {
        pageSize: 'A4',
        header: [header],
        background: [{
            image: 'fundo',
            alignment: 'center',
            opacity: 0.2,
            margin: [0, 100, 0, 0]
        }],
        content: [content],
        images: {
            fundo: 'https://media.istockphoto.com/vectors/wrench-and-screwdriver-tools-drawing-vector-id492669132?k=20&m=492669132&s=170667a&w=0&h=00tAGt_sHXbpdWtYPKy2cG_dK7LpMxB2azYh9eAYkhk=',
        },

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
export default EmitirOS;