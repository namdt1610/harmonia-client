import { useLoginMutation } from "@/redux/services/userApi";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/slices/authSlice";
import { toast } from "sonner";

export const useLogin = () => {
  const [login, { isLoading, isError }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async (username_or_email: string, password: string) => {
    const result = await login({ username_or_email, password }).unwrap();
    toast.success("Đăng nhập thành công!");
    dispatch(setAuth(result.user));
    sessionStorage.setItem("access_token", result.access);
    return result;
  };

  return {
    handleLogin,
    isLoading,
    isError,
  };
};
