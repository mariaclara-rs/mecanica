import Search from "./Search";

export default function AreaSearch({placeholder, value, onChange, onBlur, onClick, children,...props}) {
    return (
        <div className="row mt-5 mb-12" style={{marginBottom: '1rem'}}>
            <div className="col-md-5">
                <Search>
                    <Search.Input placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} {...props}/>
                    <Search.Span onClick={onClick} />
                </Search>
            </div>
            {children}
        </div>
    )
}