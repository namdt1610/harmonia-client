import { useRegisterMutation } from "@/redux/services/userApi";

export const useRegister = () => {
      const [register, { isLoading, isError }] = useRegisterMutation();

      const handleRegister = async (username: string, email: string, password: string) => {
            try {
                  const result = await register({ username, email, password }).unwrap();
                  return result;
            } catch (error) {
                  console.error("Register failed:", error);
                  alert("Đăng ký thất bại.");
                  throw error;
            }
      };

      return {
            handleRegister,
            isLoading,
            isError
      }
}