import { useEffect } from "react";
import { Form, useActionData, useNavigation, useNavigate, ActionFunctionArgs } from "react-router-dom";
import { api } from "@/lib/axios";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const response = await api.post("/auth/login", { email, password });
    console.log(response,"response")
    return { accessToken: response.data.token, error: null };
  } catch (err: any) {
    return { 
        accessToken: null,
        error: err.response?.data?.message || "Login failed. Please check your credentials." 
    };
  }
}

export default function LoginPage() {
  const actionData = useActionData() as { accessToken?: string; error?: string } | undefined;
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    console.log("actionData", actionData)
    if (actionData?.accessToken) {
        login(actionData.accessToken);
        navigate("/posts", { replace: true });
    }
  }, [actionData, login, navigate]);

  // If we want detailed redirect after login, we can do it here:
  // but wait, navigate inside generic effect depends on `login` state change.
  // actually, let's keep it simple:
  // if actionData has token -> login() -> React Router triggers re-render -> ProtectedLayout (if we were there) would render.
  // But we are on /auth/login. We need to go to /posts.
  
  // Let's check AuthProvider again. It DOES NOT automatically redirect.
  // So we need to navigate.
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Use the provided credentials to access the board
          </p>
        </div>
        
        <Form method="post" className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
              />
            </div>
          </div>

          {actionData?.error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {actionData.error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
