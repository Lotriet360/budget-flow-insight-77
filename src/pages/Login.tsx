import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/firebase"; // ✅ Your Firebase config file
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Persist session across tabs/browser restarts
      await setPersistence(auth, browserLocalPersistence);

      // ✅ Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // ✅ Redirect after successful login
      navigate("/dashboard"); // change to your desired page
        } catch (err) {
        const error = err as FirebaseError;

        console.error("Login failed:", error);
        if (error.code === "auth/user-not-found") {
            setError("No account found with this email.");
        } else if (error.code === "auth/wrong-password") {
            setError("Incorrect password.");
        } else {
            setError("Login failed. Please try again.");
        }
        }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a href="/register" className="text-primary hover:underline">Sign up</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
