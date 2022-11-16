export default function Select({ cols, label, id, register, value, onChange, erro, classes = "form-select", leitura = false, children }) {
    if (classes != "form-select") {
        classes = "form-select " + classes
    }
    return (
        <div className={cols}>
            {(label != "" && label!=undefined) &&
                <label htmlFor={id}>{label}</label>}
            {register ?
                leitura ?
                    <select disabled id={id} name={id} className={classes} {...register(id)}
                        value={value} onChange={onChange} defaultValue="" style={{textAlign: 'justify'}}>
                        <option value="" disabled >Selecione</option>
                        {children}
                    </select>
                    :
                    <select id={id} name={id} className={classes} {...register(id)}
                        value={value} onChange={onChange} defaultValue="" style={{textAlign: 'justify'}}>
                        <option value="" disabled >Selecione</option>
                        {children}
                    </select>
                :
                leitura ?
                    <select disabled id={id} name={id} className={classes}
                        value={value} onChange={onChange} defaultValue="" style={{textAlign: 'justify'}}>
                        <option value="" disabled>Selecione</option>
                        {children}
                    </select>
                    :
                    <select id={id} name={id} className={classes}
                        value={value} onChange={onChange} defaultValue="" style={{textAlign: 'justify'}}>
                        <option value="" disabled>Selecione</option>
                        {children}
                    </select>
            }
            {erro && <p className="erroForm">{erro?.message}</p>}
        </div >
    )
}

export function SelectReadOnly({ cols, label, id, children, value = id }) {
    return (
        <div className={cols}>
            <label htmlFor={id}>{label}</label>
            <select disabled id={id} name={id} className="form-select"
                value={value}>
                <option value="" disabled>Selecione</option>
                {children}
            </select>
        </div>
    )
}
