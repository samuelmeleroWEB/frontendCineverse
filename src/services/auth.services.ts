export  async function  registrarUsuarios(email:string,password:string){
const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
});
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json(); 
}
export  async function  loginUsuarios(email:string,password:string){
const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`,{
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
});
  if (!res.ok) throw new Error('Error al iniciar sesion');
  return res.json(); 
}
