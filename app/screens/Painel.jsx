import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteProduct, getProducts, updateProduct } from "@/service"
import { PencilIcon } from "lucide-react"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


const Painel = () => {

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [backup, setBackup] = useState([])
    
    const [changes, setChanges] = useState({})
    
    useEffect(() => {
        async function getData() {
            let response = await getProducts()
            setProducts(response)
            setBackup(response)
            response.forEach(product => {
                changes[product.docId] = product
            })
            setLoading(false)
        }
        getData()
    }, [])

    // const handleChange = (docId, field, value) => {
    //     let newChanges = changes
    //     newChanges[docId][field] = value
    //     setChanges(newChanges)
    //     console.log(changes[docId][field])
    // }

    const handleChange = (docId, field, value) => {
        setChanges(prevChanges => {
            // Criar uma cópia profunda do estado anterior
            const newChanges = { ...prevChanges };
            
            // Modificar o valor desejado
            newChanges[docId] = { ...newChanges[docId], [field]: value };
    
            // Imprimir o valor atualizado (pode ser assíncrono)
            console.log(newChanges[docId][field]);
    
            // Retornar o novo estado
            return newChanges;
        });
    };

    const handleSubmit = async (docId) => {
        await updateProduct(docId, changes[docId])
        let updateProducts = products
        updateProducts.forEach(product => {
            if(product.docId === docId) {
                product = {
                    ...changes[docId]
                }
            }
        })
        setProducts(updateProducts)
        toast({
            title: `Produto ${changes[docId]["descricao"]} atualizado com sucesso`
        })
    }

    const handleSearch = (text) => {
        setProducts(backup.filter((product) => product.marca.toLowerCase().includes(text) || product.catalogo.toLowerCase().includes(text) || product.corretivaOuPreventiva.toLowerCase().includes(text) || product.descricao.toLowerCase().includes(text) || product.codTmax.toLowerCase().includes(text) || product.modelo.toLowerCase().includes(text) || product.codFabricante.toLowerCase().includes(text)))
    }

    const handleDelete = async (id) => {
        await deleteProduct(id)
        setProducts(products.filter((product => product.docId !== id)))
        toast({
            title: `Produto ${changes[docId]["descricao"]} deletado com sucesso`
        })
    }
    
    return (
        <div className="sm:m-5">
            {loading ? (
                <p>Carregando dados...</p>
            ) : (
                
                    <>
                    <Input onChange={(e) => handleSearch(e.target.value.toLowerCase())} className="mb-4 w-full"  placeholder="Pesquisar" />
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead>Marca</TableHead>
                                <TableHead>Modelo</TableHead>
                                <TableHead>Código TMAX</TableHead>
                                <TableHead>Código de Fabricante</TableHead>
                                <TableHead>Quant.</TableHead>
                                <TableHead>Catálogo</TableHead>
                                <TableHead>Corretiva ou Preventiva</TableHead>
                                <TableHead>Manutenção</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="text-right">Editar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((produto) => (
                            <TableRow key={produto.codFabricante}>
                                <TableCell className="font-medium"><Badge className={`${produto.active ? "bg-green-500" : "bg-red-500"}`}>{produto.active ? "ATIVO" : "INATIVO"}</Badge></TableCell>
                                <TableCell>{produto.marca}</TableCell>
                                <TableCell>{produto.modelo}</TableCell>
                                <TableCell>{produto.codTmax}</TableCell>
                                <TableCell>{produto.codFabricante}</TableCell>
                                <TableCell>{produto.quantidade}</TableCell>
                                <TableCell>{produto.catalogo}</TableCell>
                                <TableCell>{produto.corretivaOuPreventiva}</TableCell>
                                <TableCell>{produto.manutencao}</TableCell>
                                <TableCell>{produto.descricao}</TableCell>
                                <TableCell className="text-right">



                                <Dialog className="sm:max-w-[425px] max-h-screen overflow-y-auto">
                                    <DialogTrigger asChild>
                                        <Button variant="icon"><PencilIcon /></Button>
                                    </DialogTrigger>
                                    <DialogContent className={"lg:w-[425px] overflow-y-scroll max-h-screen"}>
                                        <DialogHeader>
                                        <DialogTitle>Editar item</DialogTitle>
                                        <DialogDescription>
                                            Altere as informações que deseja e depois salve quando já tiver terminado
                                        </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Marca
                                                </Label>
                                                <Input
                                                    id="name"
                                                    defaultValue={produto.marca}
                                                    onChange={(e) => handleChange(produto.docId, "marca", e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Descrição
                                                </Label>
                                                <Input
                                                    id="username"
                                                    onChange={(e) => handleChange(produto.docId, "descricao", e.target.value)}
                                                    defaultValue={produto.descricao}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Descrição Completa
                                                </Label>
                                                <Input
                                                    id="name"
                                                    defaultValue={produto.descricaoCompleta}
                                                     
                                                    onChange={(e) => handleChange(produto.docId, "descricaoCompleta", e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Quantidade
                                                </Label>
                                                <Input
                                                    id="username"
                                                    onChange={(e) => handleChange(produto.docId, "quantidade", e.target.value)}
                                                     
                                                    defaultValue={produto.quantidade}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Catálogo
                                                </Label>
                                                <Input
                                                    id="name"
                                                     
                                                    defaultValue={produto.catalogo}
                                                    onChange={(e) => handleChange(produto.docId, "catalogo", e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Código Fabricante
                                                </Label>
                                                <Input
                                                    id="username"
                                                    onChange={(e) => handleChange(produto.docId, "codFabricante", e.target.value)}
                                                     
                                                    defaultValue={produto.codFabricante}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Código TMAX
                                                </Label>
                                                <Input
                                                    id="name"
                                                     
                                                    defaultValue={produto.codTmax}
                                                    onChange={(e) => handleChange(produto.docId, "codTmax", e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                Corretiva ou Preventiva
                                                </Label>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="col-span-3 text-start">{changes[produto.docId]['corretivaOuPreventiva']}</Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full">
                                                        <DropdownMenuRadioGroup value={changes[produto.docId]['corretivaOuPreventiva']} onValueChange={(e) => handleChange(produto.docId, "corretivaOuPreventiva", e)}>
                                                            <DropdownMenuRadioItem value="Corretiva">Corretiva</DropdownMenuRadioItem>
                                                            <DropdownMenuRadioItem value="Preventiva">Preventiva</DropdownMenuRadioItem>
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuContent>
                                                    </DropdownMenu>
                                            </div>
                                            {changes[produto.docId]['corretivaOuPreventiva'].toUpperCase() == 'PREVENTIVA' && (
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label  className="text-right">
                                                    Manutenção
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        defaultValue={produto.manutencao}
                                                        onChange={(e) => handleChange(produto.docId, "manutencao", e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            )}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label  className="text-right">
                                                    Modelo
                                                </Label>
                                                <Input
                                                    id="username"
                                                    onChange={(e) => handleChange(produto.docId, "modelo", e.target.value)}
                                                     
                                                    defaultValue={produto.modelo}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button className="bg-red-500" onClick={() => handleDelete(produto.docId)} type="submit">Excluir</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button onClick={() => handleSubmit(produto.docId)} type="submit">Salvar</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                    </Dialog>




                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </>
            )}
        </div>
    )
}

export default Painel