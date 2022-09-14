import api from "./services/api";

export const token = () => 
    localStorage.getItem("token");

export async function isAuthenticated(){
    const resp = await api.post('/authenticate')
    return resp.data.status
};