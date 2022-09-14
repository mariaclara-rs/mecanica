import { Form as F } from 'react-bootstrap';
import '../style.css'
import InputMask from "react-input-mask";


export default function Form({ props, children, className = "row g-3" }) {
    return (
        <form className={className} {...props}>{children}</form>
    )
}
export function InputRO({ cols, id, label,...inputprops }) {
    return (
        <div className={cols}>
            <label htmlFor={id}>{label}</label>
            <input className="form-control" id={id} {...inputprops} />
        </div>
    )
}
export function Input({ cols, id, label, mascara, register, erro,...inputprops }) {
    return (
        <div className={cols}>
            <label htmlFor={id}>{label}</label>
            <InputMask mask={mascara} maskChar="" className="form-control" id={id} {...register(id)} {...inputprops} />
            {erro && <p className="erroForm">{erro?.message}</p>}
            
        </div>

    )
}
export function InputArea(props) {
    return (
        <F.Group className="mb-3">
            <F.Label>{props.label}</F.Label>
            <F.Control as="textarea" rows={3} {...props} />
        </F.Group>
    )
}

Form.Input = Input;
Form.InputArea = InputArea;
Form.InputRO = InputRO;
