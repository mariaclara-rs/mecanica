import { BiSearchAlt } from "react-icons/bi";

export default function Search({ children}) {
    return (
        <div className="input-group">
            {children}
        </div>
    );
}
export function Input(props) {
    return (
        <input type="text" className="form-control"
            aria-describedby="button-addon2" {...props} />
    );
}
export function Span(props) {
    return (
        <span className="btn btn-outline-dark" type="button" id="button-addon2" {...props}>
            <BiSearchAlt size={17} />
        </span>
    );
}

Search.Input = Input;
Search.Span = Span;
