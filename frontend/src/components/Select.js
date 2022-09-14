export default function Select({ cols, label, id, register, value, onChange, erro, children }) {
    return (
        <div className={cols}>
            <label htmlFor={id}>{label}</label>
            <select id={id} name={id} className="form-select" {...register(id)}
                value={value} onChange={onChange}>
                <option value={""} disabled selected>Selecione</option>
                {children}
            </select>
            {erro && <p className="erroForm">{erro?.message}</p>}
        </div>
    )
}

export function SelectReadOnly({ cols, label, id, children}) {
    return (
        <div className={cols}>
            <label htmlFor={id}>{label}</label>
            <select disabled id={id} name={id} className="form-select"
                value={id}>
                {children}
            </select>
        </div>
    )
}
