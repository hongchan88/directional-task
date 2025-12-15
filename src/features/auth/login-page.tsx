import { useEffect } from "react";
import { Form, useActionData, useNavigation, useNavigate, ActionFunctionArgs } from "react-router-dom";
import { api } from "@/lib/axios";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const response = await api.post("/auth/login", { email, password });
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
    if (actionData?.accessToken) {
        login(actionData.accessToken);
        navigate("/posts", { replace: true });
    }
  }, [actionData, login, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
                Enter your credentials to access your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form method="post" className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                
                {actionData?.error && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                        {actionData.error}
                    </div>
                )}

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
