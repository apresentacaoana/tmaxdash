import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import {useCookies} from 'react-cookie'
import { getUserByEmail } from "@/service"
 
const FormSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, {
    message: "Informe um email válido"
  }),
  senha: z.string().min(1, {
    message: "Informe a senha"
  })
})

const Login = ({setUser}) => {
    const [cookies, setCookie] = useCookies(['user'])

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          email: "",
          senha: ""
        },
      })
     
      async function onSubmit(data) {
        
        let response = await getUserByEmail(data.email)
        console.log(response)
        if(Object.values(response).length < 1) {
            return toast({
                title: "Conta não encontrada",
                variant: "destructive"
            })
        }
        if(response.senha !== data.senha) {
            return toast({
                title: "Senha incorreta",
                variant: "destructive"
            })
        }
        if(!response.owner) {
            return toast({
                title: "Essa conta não tem permissão para acessar essa área",
                variant: "destructive"
            })
        }
        
        toast({
            title: "Parabéns! Acaba de entrar no painel administrativo do aplicativo",
            bgcolor: "green"
        })

        setUser(response)
        setCookie('user', response)

        // toast({
        //   title: "Parabéns acaba de entrar no banco de dados",
        // })

      }
    return (
        <div className="w-full h-screen flex justify-center items-center">
            
            <div className="w-[300px] flex flex-col justify-center items-center">
                {/* <p className="font-bold text-[20px] text-center mb-4">Painel Administrativo</p> */}
                <img src={"/image/logo.png"} alt="logo"  />
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4 space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Entrar</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Login