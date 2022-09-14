import Search from "./Search";

export default function AreaSearch({placeholder, value, onChange, onBlur, onClick,children}) {
    return (
        <div className="row mt-5 mb-3">
            <div className="col-md-5">
                <Search>
                    <Search.Input placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} />
                    <Search.Span onClick={onClick} />
                </Search>
            </div>
            {children}
        </div>
    )
}