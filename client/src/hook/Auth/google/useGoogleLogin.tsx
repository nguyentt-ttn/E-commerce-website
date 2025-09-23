export const useGoogleLogin = () => {
  const login = () => {
    // Redirect trực tiếp sang BE
    window.location.href = "http://localhost:8080/api/auth/google"
  }

  return { login }
}
