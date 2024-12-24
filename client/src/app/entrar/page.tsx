"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notification } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/schemas";
import userServiceInstance from "@/services/UserService";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const { signIn, isAuthenticated } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleFormSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await userServiceInstance.findByEmail(data.email);
      await signIn(data);
      toast({
        title: Notification.SUCCESS.LOGIN.TITLE,
        description: Notification.SUCCESS.LOGIN.DESCRIPTION,
      });
    } catch {
      toast({
        variant: "destructive",
        title: Notification.ERROR.LOGIN.TITLE,
        description: Notification.ERROR.LOGIN.DESCRIPTION,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="w-full h-full flex justify-center items-center">
      <Link href={"/"} className="absolute top-8 left-8">
        <ArrowLeft size={24} />
      </Link>
      <Card className="max-w-sm">
        <CardHeader className="flex flex-col text-center">
          <CardTitle className="text-2xl font-bold">
            Entrar na sua conta
          </CardTitle>
          <CardDescription className="text-read text-sm">
            Preencha os campos para acessar sua conta e começar a reservar
            espaços.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="email" className="font-semibold">
                  E-mail
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="email@exemplo.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>
              <div className="w-full relative flex flex-col gap-2">
                <Label htmlFor="password" className="font-semibold">
                  Senha
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Sua senha"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-8 text-neutral-400"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeIcon size={20} />
                  ) : (
                    <EyeOffIcon size={20} />
                  )}
                </button>
                {form.formState.errors.password && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.password.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading ? <Spinner size="small" /> : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
