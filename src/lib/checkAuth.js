
export async function checkAuth(setAuth) {
    return !!localStorage.getItem('access')
}
