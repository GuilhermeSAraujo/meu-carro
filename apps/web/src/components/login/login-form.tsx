import { GoogleLoginButton } from "@/components/login/google-login-button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Car, Shield, Wrench, Sparkles, ChevronRight } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-2 border-blue-200 dark:border-blue-900 shadow-2xl shadow-blue-500/20">
        <CardContent className="grid p-0 md:grid-cols-2 gap-0 md:min-h-[500px]">
          {/* Seção de Login */}
          <section className="p-6 md:p-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

            <FieldGroup className="relative z-10">
              <div className="flex flex-col items-center gap-3 text-center mb-2">
                {/* Ícone de Logo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-40"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                    <Car className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                    Bem-vindo de volta
                  </h1>
                  <p className="text-muted-foreground text-balance text-base">
                    Entre na sua conta{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Meu Carro
                    </span>
                  </p>
                </div>

                {/* Badges de Recursos */}
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-300 dark:border-blue-700">
                    <Shield className="w-3.5 h-3.5" />
                    Seguro
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-300 dark:border-purple-700">
                    <Wrench className="w-3.5 h-3.5" />
                    Manutenção
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 text-orange-700 dark:text-orange-300 text-xs font-medium border border-orange-300 dark:border-orange-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    Prático
                  </span>
                </div>
              </div>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-gradient-to-r *:data-[slot=field-separator-content]:from-transparent *:data-[slot=field-separator-content]:via-card *:data-[slot=field-separator-content]:to-transparent my-6">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Entre ou cadastre-se com
                </span>
              </FieldSeparator>

              <Field>
                <GoogleLoginButton />
              </Field>
            </FieldGroup>
          </section>

          {/* Seção de Imagem com Gradiente */}
          <div className="relative hidden md:block overflow-hidden">
            {/* Gradiente overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-pink-600/90 z-10 mix-blend-multiply"></div>

            {/* Padrão de pontos decorativo */}
            <div
              className="absolute inset-0 z-20 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            {/* <img
              src="/car-repair.svg"
              alt="Mecânico consertando um carro"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            /> */}

            {/* Conteúdo sobre a imagem */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-white">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 mb-4">
                  <Car className="w-10 h-10" strokeWidth={2} />
                </div>
                <h2 className="text-3xl font-bold drop-shadow-lg">Gerencie seu veículo</h2>
                <p className="text-lg text-white/90 max-w-sm drop-shadow">
                  Acompanhe manutenções, despesas e mantenha seu carro sempre em dia
                </p>

                {/* Stats decorativos */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-white/80">Usuários</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1K+</div>
                    <div className="text-sm text-white/80">Veículos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">5K+</div>
                    <div className="text-sm text-white/80">Serviços</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-sm">
        Ao continuar, você concorda com nossos{" "}
        <a
          href="#"
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 transition-colors"
        >
          Termos de Serviço
        </a>{" "}
        e{" "}
        <a
          href="#"
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 transition-colors"
        >
          Política de Privacidade
        </a>
        .
      </FieldDescription>
    </div>
  );
}
