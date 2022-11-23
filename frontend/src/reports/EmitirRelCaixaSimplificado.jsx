import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function formatarData(data) {
    if (data == "" || data == null)
        return "";
    data = data.split('-');
    return data[2] + '/' + data[1] + '/' + data[0];
}

function aredondar(val) {
    return Math.round(val * 100) / 100
}

function body(rel) {
    var bd = [];
    var saldoFinal = 0;
    rel.map((reg) => {
        saldoFinal+=(reg.totEntradas-reg.totSaidas)
        bd.push(
            { text: "Data" + ": " + formatarData(reg.data), style: 'header' },
            {
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [
                            { text: 'Total Entradas (R$)', style: 'header' },
                            { text: reg.totEntradas }
                        ],
                        [
                            { text: 'Total Saídas (R$)', style: 'header' },
                            { text: reg.totSaidas }
                        ],
                        [
                            { text: 'Saldo final (R$)', style: 'header' },
                            { text: reg.totEntradas-reg.totSaidas }
                        ]
                    ],
                },
                margin: [0, 0, 0, 10]
            }
        )
    })
    return [bd,aredondar(saldoFinal)];
}

function EmitirRelCaixaSimplificado(dataIni, dataFim, dadosRel, mecanica) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    let textFooter = "";
    if (mecanica != null) {
        if (mecanica.mec_nome != "")
            textFooter += mecanica.mec_nome + "\n";
        if (mecanica.mec_endereco != "")
            textFooter += mecanica.mec_endereco + ", ";
        if (mecanica.mec_num != "")
            textFooter += mecanica.mec_num + " - ";
        if (mecanica.mec_bairro != "")
            textFooter += mecanica.mec_bairro;
        if (mecanica.mec_cidade != "")
            textFooter += "\n" + mecanica.mec_cidade
    }
    var rel = [];
    var dt, i;
    var totEntrada, totSaida;
    var tam = dadosRel.length;
    for (i = 0; i < tam;) {
        dt = dadosRel[i].data;
        totEntrada = 0; totSaida = 0;
        while (i < tam && dt == dadosRel[i].data) {
            if (dadosRel[i].tipo == 'OS' || dadosRel[i].tipo == 'CR') {
                totEntrada += dadosRel[i].val;
            }
            else {
                totSaida += dadosRel[i].val;
            }
            i += 1;
        }
        rel.push({
            data: dt.split('T')[0], totEntradas: aredondar(totEntrada), totSaidas: aredondar(totSaida)
        })
    }
    const header = [{
        text: 'Relátorio de Caixa',
        fontSize: 15,
        bold: true,
        margin: [40, 20, 20, 0]
    }];
    var bd = body(rel);
    const content = [
        {
            text: [
                { text: 'De: ', bold: true },
                { text: formatarData(dataIni) },
                { text: ' Até: ', bold: true },
                { text: formatarData(dataFim) }
            ],
            fontSize: 11,
            margin: [0, 5, 20, 20]
        },
        bd[0],
        {
            columns: [
                {
                    width: 'auto',
                    text: 'Saldo Final do Período (R$):',
                    style: 'header',
                    color: 'red'
                },
                {
                    width: '*',
                    text: aredondar(bd[1])
                }
            ],
        }
    ];

    const doc = {
        pageSize: 'A4',
        header: header,
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
export default EmitirRelCaixaSimplificado;